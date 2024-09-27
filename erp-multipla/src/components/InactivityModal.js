// InactivityModal.js
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const InactivityModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Inactivity Notification"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Sessão Expirada</h2>
      <p>Sua sessão foi deslogada devido a inatividade.</p>
      <button onClick={onRequestClose}>OK</button>
    </Modal>
  );
};

export default InactivityModal;
