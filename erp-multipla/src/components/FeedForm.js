import React from 'react';
import './TestComponent.css';

const TestComponent = () => {
  return (
    <div className="test-component">
      <img src={`${process.env.PUBLIC_URL}/logomodelo.png`} alt="Logo" className="logo-home" />
    </div>
  );
};

export default TestComponent;
