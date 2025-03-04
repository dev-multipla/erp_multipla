import React from 'react';
import { Calendar } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  showDatePicker = false,
  selectedDate = new Date().toISOString().split('T')[0],
  onDateChange
}) => {
  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? 'visible' : 'invisible'}`}
      aria-hidden={!isOpen}
    >
      {/* Fundo escuro */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Conteúdo do modal */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
        {/* Cabeçalho */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        {/* Seletor de data */}
        {showDatePicker && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data da Baixa
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
