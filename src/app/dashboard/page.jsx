"use client"

import { useState } from 'react';
import { Trees, LogOut, Plus, Edit2, Trash2 } from 'lucide-react';
import AddRowModal from '../components/AddRowModal';
import EditRowModal from '../components/EditRowModal';
import supabase from '../utils/supabaseClient';

function DashboardPage() {

  async function getData() {
    const { data, error } = await supabase
    .from('users') // Name of your table in Supabase
    .select('*'); // Fetches all columns 

    return data;
  }

let data;
// Using .then() to handle the resolved data from getData
getData().then(response => {
  data = response; // 'response' will be the data returned from the getData function
});


  const [rows, setRows] = useState([
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Brown' }
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const handleAdd = (newName) => {
    setRows([...rows, { id: Date.now(), name: newName }]);
    setIsAddModalOpen(false);
  };

  const handleEdit = (id, newName) => {
    setRows(rows.map(row => row.id === id ? { ...row, name: newName } : row));
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const openEditModal = (row) => {
    setEditingRow(row);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Trees className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Treelink</span>
            </div>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* User Info */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">kk</h2>
            <p className="text-gray-600">@johndoe</p>
          </div>

          {/* Table Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Your Links</h3>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add New
            </button>
          </div>

          {/* Table */}
          <div className="space-y-3">
            {rows.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">{row.name}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEditModal(row)}
                    className="text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddRowModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />
      <EditRowModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        row={editingRow}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default DashboardPage;