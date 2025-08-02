// ConfirmModal.js
import React from 'react';
import './ConfirmModal.css';
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {title && <h2>{title}</h2>}
        {message && <p>{message}</p>}
        <div className="modal-actions">
          <button onClick={onCancel} className="cp-cancel-btn">
            Cancelar <MdOutlineCancel />
          </button>
          <button onClick={onConfirm} className="cp-confirm-btn">
            Confirmar <GiConfirmed />
          </button>
        </div>
      </div>
    </div>
  );
};

// Definir valores padrão para as props
ConfirmModal.defaultProps = {
  isOpen: false,
  title: '',
  message: '',
  onConfirm: () => {},
  onCancel: () => {}
};

export default ConfirmModal;