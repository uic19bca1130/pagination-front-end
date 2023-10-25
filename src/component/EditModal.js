import React from 'react';

const EditModal = ({ isOpen, onClose, onSave, onSaveNew, name, setName, lastName, setLastName, isNew }) => {
  if (!isOpen) return null;

  const handleSave = () => {
    if (isNew) {
      onSaveNew(); 
    } else {
      onSave(); 
    }
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{isNew ? 'Add New Product' : 'Edit Product'}</h2>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <div className="modal-buttons">
          <button onClick={handleSave}>{isNew ? 'Add' : 'Save'}</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
