import React from 'react';
import {Stage, Layer, Star} from 'react-konva';

const canvasWidth = 700;
const canvasHeight = 350;

function generateShapes() {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    rotation: Math.random() * 180,
    isDragging: false,
  }));
}

const INITIAL_STATE = generateShapes();

function Canvas() {
  const [stars, setStars] = React.useState(INITIAL_STATE);

  const handleDragStart = (e) => {
    const id = e.target.id();
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: star.id === id,
        };
      })
    );
  };

  const handleDragEnd = (e) => {
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: false,
        };
      })
    );
  };

  return (
    <div className='stage'>
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {stars.map((star) => (
            <Star
              key={star.id}
              id={star.id}
              x={star.x}
              y={star.y}
              numPoints={5}
              innerRadius={20}
              outerRadius={40}
              fill="#89b717"
              opacity={0.8}
              //draggable
              rotation={star.rotation}
              shadowColor="black"
              shadowBlur={10}
              shadowOpacity={0.6}
              shadowOffsetX={star.isDragging ? 10 : 5}
              shadowOffsetY={star.isDragging ? 10 : 5}
              scaleX={star.isDragging ? 1.2 : 1}
              scaleY={star.isDragging ? 1.2 : 1}
              //onDragStart={handleDragStart}
              //onDragEnd={handleDragEnd}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default Canvas;