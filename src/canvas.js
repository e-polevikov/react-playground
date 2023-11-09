import { useState, useRef } from 'react';
import {Stage, Layer, Circle} from 'react-konva';

const canvasWidth = window.innerWidth * 0.7;
const canvasHeight = window.innerHeight * 0.8;

const initialCircleRadius = 20;
const initialNumberOfCircles = 15;

const initialP = 0.3;

function calculateEnergy(circle1, circle2) {
  let xDist = Math.pow((circle1.x - circle2.x), 2);
  let yDist = Math.pow((circle1.y - circle2.y), 2);
  let totalDist = Math.sqrt(xDist + yDist);
  let energy = Math.pow(10, 10) * 4 * (1 / Math.pow(totalDist, 12) - 1 / Math.pow(totalDist, 6));
  return energy;
}

function calculateFullEnergy(circles) {
  let fullEnergy = 0.0;

  for (let i = 0; i < circles.length - 1; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      fullEnergy += calculateEnergy(circles[i], circles[j]);
    }
  }

  return fullEnergy;
}

function checkIntersection(circles, randX, randY, circleId, circleRadius) {
  let circleIntersecsExisting = false;

  for (let i = 0; i < circles.length; i++) {
    if (i === circleId) {
      continue;
    }

    let xDistance = (circles[i].x - randX) * (circles[i].x - randX);
    let yDistance = (circles[i].y - randY) * (circles[i].y - randY);

    if (xDistance + yDistance <= 4 * circleRadius * circleRadius) {
      circleIntersecsExisting = true;
      break;
    }
  }

  let circleIntersectsCanvas = false;

  if (randX - circleRadius < 0.0 || randX + circleRadius >= canvasWidth) {
    circleIntersectsCanvas = true;
  }

  if (randY - circleRadius < 0.0 || randY + circleRadius >= canvasHeight) {
    circleIntersectsCanvas = true;
  }

  return circleIntersecsExisting || circleIntersectsCanvas;
}

function generateCircles(circlesCount, circleRadius) {
  let circles = [];
  let numberOfGeneratedCircles = 0;

  while (numberOfGeneratedCircles < circlesCount) {
    let randX = Math.random() * canvasWidth;
    let randY = Math.random() * canvasHeight;
    let generatedCircleId = numberOfGeneratedCircles + 1;

    if (!checkIntersection(circles, randX, randY, generatedCircleId, circleRadius)) {
      circles.push({
        id: numberOfGeneratedCircles.toString(),
        x: randX, y: randY
      });
      numberOfGeneratedCircles += 1;
    }
  }

  return circles;
}

function Canvas() {
  const [circleRadius, setCircleRadius] = useState(initialCircleRadius);
  const [circlesCount, setCirclesCount] = useState(initialNumberOfCircles);
  const [p, setP] = useState(initialP);
  const [circles, setCircles] = useState(generateCircles(circlesCount, circleRadius));
  const [fullEnergy, setFullEnergy] = useState(calculateFullEnergy(circles));
  const intervalRef = useRef(null);

  function moveCirclesHandler() {
    intervalRef.current = setInterval(() => {
      moveCirclesWrapper();
    }, 10);
  }

  function stopMoveHandler() {
    clearInterval(intervalRef.current);
  }

  function newStateHandler() {
    clearInterval(intervalRef.current);

    let currentCircleRadius = document.getElementById('circle-radius').value;
    let currentCirclesCount = document.getElementById('circles-count').value;
    let currentP = document.getElementById('circle-move-probability').value;

    setCircleRadius(currentCircleRadius);
    setCirclesCount(currentCirclesCount);
    setP(currentP);

    setCircles(generateCircles(currentCirclesCount, currentCircleRadius));
    setFullEnergy(calculateFullEnergy(circles));
  }

  function moveCirclesWrapper() {
    let circlesCopy = JSON.parse(JSON.stringify(circles));

    circlesCopy.map((circle) => {
      let circleIsMoved = false;
      let numAttempsToMove = 0;
      let maxNumAttemptstoMove = 5;
      let currentX = circle.x;
      let currentY = circle.y;

      while (!circleIsMoved && numAttempsToMove < maxNumAttemptstoMove) {
        let randX = circle.x + (Math.random() - 0.5) * 10;
        let randY = circle.y + (Math.random() - 0.5) * 10;
        let currentCircleId = Number(circle.id);

        if (!checkIntersection(circlesCopy, randX, randY, currentCircleId, circleRadius)) {
          circle.x = randX;
          circle.y = randY;
          circleIsMoved = true;
        }

        numAttempsToMove += 1;
      }

      if (calculateFullEnergy(circlesCopy) > calculateFullEnergy(circles)) {
        if (Math.random() < 1 - p) {
          circle.x = currentX;
          circle.y = currentY;
        }
      }
      
      return circle;
    });

    for (let i = 0; i < circles.length; i++) {
      circles[i] = circlesCopy[i];
    }

    setCircles(circles);
    setFullEnergy(calculateFullEnergy(circles));
  };

  return (
    <>
      <h1>Эксперимент по сворачиванию белка</h1>
      <div className='params-container'>
        <label>Радиус частицы: </label>
        <input id='circle-radius' type='number' defaultValue={initialCircleRadius}/>
        <br/><br/>

        <label>Количество частиц: </label>
        <input id='circles-count' type='number' defaultValue={initialNumberOfCircles}/>
        <br/><br/>

        <label>P: </label>
        <input id='circle-move-probability' type='number' defaultValue={initialP}></input>
        <br/><br/>

        <button onClick={newStateHandler}>Обновить</button>

        <br/>
        <hr></hr>

        <button onClick={moveCirclesHandler}>Старт</button>
        <button onClick={stopMoveHandler}>Пауза</button>

        <br/>

        <p>Начальная энергия взаимодействия: ...</p>
        <p>Минимальная энергия взаимодействия: ...</p>
        <p>Энергия взаимодействия: {fullEnergy.toFixed(2)}</p>
      </div>
      <div className='stage'>
        <Stage width={canvasWidth} height={canvasHeight}>
          <Layer>
            {circles.map((circle) => (
              <Circle
                key={circle.id}
                id={circle.id}
                x={circle.x}
                y={circle.y}
                radius={circleRadius}
                fill='red'
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </>
  );
}

export default Canvas;
