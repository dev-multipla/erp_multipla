//RegistroContasPagar
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './RegistrosContasPagar.css';


const RegistroContaPagar = ({ onEdit }) => {
  


  return (
    <div className="registro-contas-pagar-container">
      <div className="registro-conta-pagar-list">
        <h2>Listagem de Contas a Pagar</h2>
        <ToastContainer />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Contrato</th>
              <th>Descrição</th>
              <th>Forma Pagamento</th>
              <th>Valor</th>
              <th>Data de Vencimento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {((conta) => (
              <tr key={conta.id}>
                <th>{conta.id}</th>
                <td>{conta.contrato}</td>
                <td>{[conta.contrato] || "Descrição não encontrada"}</td>
                <td>{[conta.forma_pagamento] || "Forma de pagamento não encontrada"}</td>
                <td>{conta.valor_total}</td>
                <td>{conta.data_pagamento}</td>
                <td>
                  <button onClick={() => (conta)} className="edit-button-pl">
                   
                  </button>
                  <button onClick={() => (conta.id)} className="delete-button-pl">
                    
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistroContaPagar;