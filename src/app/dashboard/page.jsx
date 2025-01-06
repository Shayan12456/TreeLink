"use client";

import { useState, useEffect } from 'react';
import { Trees, LogOut, Plus, Edit2, Trash2 } from 'lucide-react';
import AddRowModal from './components/AddRowModal';
import EditRowModal from './components/EditRowModal';
import supabase from '../../utils/supabaseClient';
import Loader from '../components/Loader';  // Your Loader component
import { useRouter } from 'next/navigation';

function DashboardPage() {
  const [data, setData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleAdd = async (newName) => {
    setIsAddModalOpen(false);
  
    const response = await fetch('/api/dashboard/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: data[0].user_id, directory_name: newName })
    });
  
    if (response.ok) {
      fetchData();  // Refetch data after successful insertion
    } else {
      const error = await response.json();
      console.error('Error adding directory:', error);
    }
  };
  
  const handleDelete = async (id, e) => {
    e.stopPropagation();

    const response = await fetch('/api/dashboard/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  
    if (response.ok) {
      // console.log(response.json())
      fetchData();  // Refetch data after successful deletion
    } else {
      const error = await response.json();
      console.error('Error deleting directory:', error);
    }
  };
  
  const handleEdit = async (id, newName) => {
    // e.stopPropagation();
    // console.log(id, newName)
    const response = await fetch('/api/dashboard/edit', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, newName })
    });
  
    if (response.ok) {
      fetchData();  // Refetch data after successful update
    } else {
      const error = await response.json();
      console.error('Error updating directory:', error);
    }
  };
  

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('users') // Change to your table 
      .select('user_id, username, email, created_at, directories(directory_id, directory_name, task_id, created_at)') // Select fields from both tables
      .order('created_at', { foreignTable: 'directories' });
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setData(data);
      setLoading(false);
    }
  };

  useEffect(() => {
      // Fetch data from Supabase
      fetchData();
  }, []); 

  if (loading) {
    return <Loader />;  // Show the loader until data is fetched
  }

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
            <h2 className="text-2xl font-bold text-gray-900">{data[0].username}</h2>
            <p className="text-gray-600">@{data[0].username}</p>
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
             {data[0].directories.map((row) => (
              <div
                key={row.directory_id}
                onClick={() => router.push(`/taskboard/${row.task_id}`)}

                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span className="font-medium text-gray-900">{row.directory_name}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e)=>{
                      e.stopPropagation();
                      setEditId(row.directory_id);
                      setIsEditModalOpen(true);
                    }}
                    // onClick={() => setIsEditModalOpen(true)}
                    className="text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(row.task_id, e)}
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
      <EditRowModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        id={editId}
        onEdit={handleEdit}
      />

      <AddRowModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />
      
    </div>
  );
}

export default DashboardPage;