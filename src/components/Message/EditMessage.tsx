import React, { useState } from "react";

interface EditMessageProps {
  message: string;
  onSave: (newMessage: string) => void;
  onCancel: () => void;
}

const EditMessage: React.FC<EditMessageProps> = ({
  message,
  onSave,
  onCancel,
}) => {
  const [editedMessage, setEditedMessage] = useState(message);

  const handleSave = () => {
    if (editedMessage.trim() !== "") {
      onSave(editedMessage);
    }
  };

  return (
    <div className="flex items-center space-x-2 p-2 bg-[#2A3441] rounded-lg">
      <input
        type="text"
        value={editedMessage}
        onChange={(e) => setEditedMessage(e.target.value)}
        className="flex-grow bg-transparent text-white outline-none"
      />
      <button
        onClick={handleSave}
        className="px-2 py-1 bg-[#D1B206] text-black rounded"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="px-2 py-1 bg-gray-600 text-white rounded"
      >
        Cancel
      </button>
    </div>
  );
};

export default EditMessage;
