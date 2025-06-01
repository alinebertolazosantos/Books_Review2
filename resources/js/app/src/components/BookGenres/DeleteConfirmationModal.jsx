// frontend/src/components/DeleteConfirmationModal.jsx

import React from "react";
import PropTypes from "prop-types";
import "./DeleteConfirmationModal.css"; // Importa o CSS específico do modal.

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    // Componente não renderiza nada se não estiver visível.
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirmar Exclusão</h2>
                <p>
                    Tem certeza de que deseja excluir{" "}
                    {itemName ? `'${itemName}'` : "este item"}? Esta ação não
                    pode ser desfeita.
                </p>
                <div className="modal-actions">
                    <button onClick={onClose} className="modal-button cancel">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="modal-button delete">
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

// Validação das propriedades do componente.
DeleteConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    itemName: PropTypes.string,
};

export default DeleteConfirmationModal;
