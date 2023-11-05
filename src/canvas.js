import React from 'react';
import {Stage, Layer, Circle} from 'react-konva';

const canvasWidth = 700;
const canvasHeight = 350;

function generateCircles() {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight
  }));
}

const INITIAL_STATE = generateCircles();

function Canvas() {
  const [circles, setCircles] = React.useState(INITIAL_STATE);

  return (
    <div className='stage'>
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {circles.map((circle) => (
            <Circle
              key={circle.id}
              id={circle.id}
              x={circle.x}
              y={circle.y}
              radius={20}
              fill='red'
              draggable
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default Canvas;