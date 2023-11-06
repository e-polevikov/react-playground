import React from 'react';
import {Stage, Layer, Circle} from 'react-konva';

const canvasWidth = 700;
const canvasHeight = 350;
const circleRadius = 20;
const initialNumberOfCircles = 10;

function checkIntersection(circles, randX, randY) {
  let randomCircleIntersecsExisting = false;

  for (let i = 0; i < circles.length; i++) {
    let xDistance = (circles[i].x - randX) * (circles[i].x - randX);
    let yDistance = (circles[i].y - randY) * (circles[i].y - randY);

    if (xDistance + yDistance <= 4 * circleRadius * circleRadius) {
      randomCircleIntersecsExisting = true;
      break;
    }
  }

  return randomCircleIntersecsExisting;
}

function generateCircles() {
  let circles = [];
  let numberOfGeneratedCircles = 0;

  while (numberOfGeneratedCircles < initialNumberOfCircles) {
    let randX = Math.random() * canvasWidth;
    let randY = Math.random() * canvasHeight;

    if (!checkIntersection(circles, randX, randY)) {
      circles.push({id: numberOfGeneratedCircles.toString(), x: randX, y: randY});
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
        circle.x = circle.x + (Math.random() - 0.5) * 10;
        circle.y = circle.y + (Math.random() - 0.5) * 10;
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
