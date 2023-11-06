import React from 'react';
import {Stage, Layer, Circle} from 'react-konva';

const canvasWidth = 700;
const canvasHeight = 350;
const circleRadius = 20;
const numberOfCircles = 10;

function generateCircles() {
  return [...Array(numberOfCircles)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight
  }));
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
