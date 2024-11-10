"use client";

import { useState, useEffect } from 'react';
import { Trees, LogOut, Plus, Edit2, Trash2 } from 'lucide-react';
import AddRowModal from '../components/AddRowModal';
import EditRowModal from '../components/EditRowModal';
import supabase from '../utils/supabaseClient';
import Loader from '../components/Loader';  // Your Loader component

function DashboardPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteRow, setDeleteRow] = useState(0);

  const handleAdd = async (newName) => {
    setIsAddModalOpen(false);

    insertData({ user_id: data[0].user_id, directory_name: newName});
    setTimeout(fetchData, 1000);
  };

  const handleDelete = (id) => {
    deleteData(id);

    setTimeout(fetchData, 1000);

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

  
    const insertData = async (row) => {
      try{
        const { data, error } = await supabase
        .from('directories') // Name of the table
        .insert(row)//pushed to DB

        if (error) {
          console.error('Error deleting data:', error);
        } else {
          console.log('Data deleted:', data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };


    // delete data from Supabase
    const deleteData = async (id) => {
      try {
        const { data, error } = await supabase
          .from('directories') // Name of the table
          .delete()
          .match({ directory_id: id }); // Replace 'id' with the column name used for row identification
  
        if (error) {
          console.error('Error deleting data:', error);
        } else {
          console.log('Data deleted:', data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    }

     
    // edit data in Supabase
    const editData = async (id, newName) => {
      try {
        const { data, error } = await supabase
          .from('directories') // Name of the table
          .update({ directory_name: newName })
          .match({ directory_id: id }); // Replace 'id' with the column name used for row identification
  
        if (error) {
          console.error('Error editing data:', error);
        } else {
          console.log('Data edited:', data);
          setTimeout(fetchData, 1000);
          setIsEditModalOpen(false);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    }

    const handleEdit = (id) => {
      setEditId(id);
      setIsEditModalOpen(true);
    };

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
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">{row.directory_name}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={()=>{handleEdit(row.directory_id)}}
                    // onClick={() => setIsEditModalOpen(true)}
                    className="text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(row.directory_id)}
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
        onEdit={editData}
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