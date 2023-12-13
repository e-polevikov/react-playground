import React from 'react';
import ReactDOM from 'react-dom/client';

import { useState, useEffect } from 'react';
import './index.css';

function Cars({ cars }) {
  return (
    <>
      <ul>
        {cars.map((car) => {
          return <li>{car.title}. Speed: {car.speed}, mileage: {car.mileage}</li>
        })}
      </ul>
    </>
  );
}

function CarDriver({ cars, setCars }) {
  const [drivingStarted, setDrivingStarted] = useState(false);

  function driveCars() {
    let newCars = cars.map((car) => {
      car.mileage += car.speed;
      return car;
    });

    setCars(newCars);
  }

  useEffect(() => {
    if (drivingStarted) {
      setTimeout(() => {
        driveCars();
      }, 1000);
    }
  });
  
  return (
    <>
      <button className='btn'
        onMouseDown={() => setDrivingStarted(true)}
        onMouseUp={() => setDrivingStarted(false)}
      >
        Drive cars
      </button>
    </>
  );
}

function App() {
  const [cars, setCars] = useState([{
      'title': 'Porsche',
      'speed': 30,
      'mileage': 0
    }, {
      'title': 'Ford',
      'speed': 40,
      'mileage': 0
    }, {
      'title': 'Mustang',
      'speed': 50,
      'mileage': 0
    }    
  ]);

  function getTotalMileage() {
    let totalMileage = 0;
    cars.forEach(car => { totalMileage += car.mileage; });
    return totalMileage;
  }

  return (
    <>
      <Cars cars={cars}/>
      <CarDriver cars={cars} setCars={setCars}/>
      <p>Total mileage: {getTotalMileage()}</p>
    </>    
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
