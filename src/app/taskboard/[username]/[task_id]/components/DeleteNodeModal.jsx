import { useState } from 'react';
import { X } from 'lucide-react';

function DeleteNodeModal({ isOpen, onClose, onDelete, id}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onDelete(id);
  };
//WHY BEFORE
//EDIT TOO LONG
//DELETE SO PARENT CONFIG
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg text-red-900 font-bold">Delete Node</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <p htmlFor="delete" className="block text-sm font-medium text-red-700">
              Are You Sure You Want To Delete The Node?
            </p>
            <br />
            <div className='w-[100%] flex justify-around'>
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border bg-emerald-600 border-gray-300 rounded-lg text-white hover:bg-emerald-700"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Delete
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteNodeModal;