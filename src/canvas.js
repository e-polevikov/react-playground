import React from 'react';
import {Stage, Layer, Circle} from 'react-konva';

const canvasWidth = window.innerWidth * 0.6;
const canvasHeight = window.innerHeight * 0.7;
const circleRadius = 20;
const initialNumberOfCircles = 15;

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

  return Math.round(fullEnergy);
}

function checkIntersection(circles, randX, randY, circleId) {
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

function generateCircles() {
  let circles = [];
  let numberOfGeneratedCircles = 0;

  while (numberOfGeneratedCircles < initialNumberOfCircles) {
    let randX = Math.random() * canvasWidth;
    let randY = Math.random() * canvasHeight;
    let generatedCircleId = numberOfGeneratedCircles + 1;

    if (!checkIntersection(circles, randX, randY, generatedCircleId)) {
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
  const [circles, setCircles] = React.useState(generateCircles());
  const [fullEnergy, setFullEnergy] = React.useState(calculateFullEnergy(circles));

  const moveCirclesHandler = (e) => {
    for (let i = 0; i < 50; i++) {
      moveCirclesWrapper();
    }
  }

  const moveCirclesWrapper = (e) => {
    let circlesCopy = JSON.parse(JSON.stringify(circles));

    circlesCopy.map((circle) => {
      let circleIsMoved = false;
      let numAttempsToMove = 0;
      let maxNumAttemptstoMove = 10;
      let currentX = circle.x;
      let currentY = circle.y;

      while (!circleIsMoved && numAttempsToMove < maxNumAttemptstoMove) {
        let randX = circle.x + (Math.random() - 0.5) * 10;
        let randY = circle.y + (Math.random() - 0.5) * 10;
        let currentCircleId = Number(circle.id);

        if (!checkIntersection(circlesCopy, randX, randY, currentCircleId)) {
          circle.x = randX;
          circle.y = randY;
          circleIsMoved = true;
        }

        numAttempsToMove += 1;
      }

      if (calculateFullEnergy(circlesCopy) > calculateFullEnergy(circles)) {
        if (Math.random() < 0.985) {
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
      <div>
        <button onClick={moveCirclesHandler}>Сдвинуть частицы</button>
      </div>
      <div>
        Энергия взаимодействия: {fullEnergy}
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
                // draggable
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </>
  );
}

export default Canvas;
