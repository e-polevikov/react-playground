import React from 'react';
import {Stage, Layer, Circle} from 'react-konva';

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight * 0.7;
const circleRadius = 20;
const initialNumberOfCircles = 10;

function calculateEnergy(circle1, circle2) {
  let xDist = Math.pow((circle1.x - circle2.x), 2);
  let yDist = Math.pow((circle1.y - circle2.y), 2);
  let totalDist = Math.sqrt(xDist + yDist);
  let energy = 4 * (1 / Math.pow(totalDist, 12) - 1 / Math.pow(totalDist, 6));
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

  return circleIntersecsExisting;
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
    setCircles(
      circles.map((circle) => {
        let circleIsMoved = false;

        while (!circleIsMoved) {
          let randX = circle.x + (Math.random() - 0.5) * 10;
          let randY = circle.y + (Math.random() - 0.5) * 10;
          let currentCircleId = Number(circle.id);

          if (!checkIntersection(circles, randX, randY, currentCircleId)) {
            circle.x = randX;
            circle.y = randY;
            circleIsMoved = true;
          }
        }
        
        setFullEnergy(calculateFullEnergy(circles));
        return circle;
      })
    );
  };

  return (
    <>
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
      <div>
        <button onClick={moveCirclesHandler}>Сдвинуть частицы</button>
      </div>
      <div>
        Энергия взаимодействия: {fullEnergy}
      </div>
    </>
  );
}

export default Canvas;
