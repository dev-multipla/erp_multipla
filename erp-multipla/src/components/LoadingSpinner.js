// LoadingSpinner.js
import React from 'react';
import { Puff } from 'react-loader-spinner'; // Importa o componente Puff diretamente
//import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <Puff color="#00BFFF" height={100} width={100} />
  </div>
);

export default LoadingSpinner;
