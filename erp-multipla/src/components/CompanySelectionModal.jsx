//src/components/CompanySelectionModal
import React from 'react';
import Modal from 'react-modal';
import { useCompany } from '../CompanyContext';
import './CompanySelectionModal.css';  // Certifique-se de ter esse arquivo

Modal.setAppElement('#root');

export default function CompanySelectionModal({ isOpen }) {
  const { companies, switchCompany } = useCompany();

  if (!companies.length) return null;

  const handleChange = e => {
    const selectedId = e.target.value;
    console.log('CompanySelectionModal: switchCompany(', selectedId, ')');
    switchCompany(selectedId);
  };

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={false}
      overlayClassName="custom-modal-overlay"
      className="custom-modal-content"
    >
      <h2>Escolha sua empresa</h2>
      <select onChange={handleChange} defaultValue="">
        <option value="" disabled>-- Selecione --</option>
        <option value="all">Todas (admin)</option>
        {companies.map(c => (
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}
      </select>
    </Modal>
  );
}
