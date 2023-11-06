import React from 'react';
import {Stage, Layer, Circle} from 'react-konva';

const canvasWidth = 700;
const canvasHeight = 350;
const circleRadius = 30;
const initialNumberOfCircles = 15;

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

const INITIAL_STATE = generateCircles();

function Canvas() {
  const [circles, setCircles] = React.useState(INITIAL_STATE);

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
    </>
  );
}

export default Canvas;
