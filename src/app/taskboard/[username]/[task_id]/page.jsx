"use client"

import React, { useEffect, useState } from 'react'
import Loader from '../../../components/Loader';  // Your Loader component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import supabase from '../../../../utils/supabaseClient';
import AddNodeModal from './components/AddNodeModal';
import EditNodeModal from './components/EditNodeModal';
import DeleteNodeModal from './components/DeleteNodeModal';
import { useParams } from 'next/navigation';

const page = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [data, setData] = useState([]);  // array of objects
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodeEdit, setSelectedNodeEdit] = useState(null);
  const [selectedNodeDelete, setSelectedNodeDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract query parameters using useSearchParams
  const searchParams = useParams();
 

  const handleAdd = async (newName, parent_id, node_direction, task_id) => {
    const defaultTask = {
      task_id,
      node_name: newName,
      parent_id,
      left_child_id: null,
      right_child_id: null,
      node_direction,
    };

    setIsAddModalOpen(false);
  
    const response = await fetch('/api/taskboard/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaultTask)
    });
  
    if (response.ok) {
      fetchData();  // Refetch data after successful insertion
    } else {
      const error = await response.json();
      console.error('Error adding Node:', error);
    }
  };

  const handleEdit = async (node_id, node_name) => {

    setIsEditModalOpen(false);
  
    const response = await fetch('/api/taskboard/edit', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ node_id, node_name })
    });
  
    if (response.ok) {
      fetchData();  // Refetch data after successful insertion
    } else {
      const error = await response.json();
      console.error('Error Updating Node:', error);
    }
  };

  const handleDelete = async (node_id) => {

    setIsDeleteModalOpen(false);
  
    const response = await fetch('/api/taskboard/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ node_id })
    });
  
    if (response.ok) {
      fetchData();  // Refetch data after successful insertion
    } else {
      const error = await response.json();
      console.error('Error Deleting Node:', error);
    }
  };
  
  const handleOpenAddModal = (node) => {
    setSelectedNode(node);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (node) => {
    setSelectedNodeEdit(node);
    setIsEditModalOpen(true);
  };
  
  const handleOpenDeleteModal = (node) => {
    setSelectedNodeDelete(node);
    setIsDeleteModalOpen(true);
  };

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('taskboard') // Change to your table 
      .select("*")
      .eq('task_id', searchParams.task_id);

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(data);
      }
      setLoading(false);

    };

  useEffect(()=>{fetchData()}, [])
  //useEffect must not return anything besides a function, which is used for clean-up
    

  if (loading) {
    return <Loader />;  // Show the loader until data is fetched
  }

  // Helper function to find a node by ID
  const findNodeById = (id) => data.find((node) => node.node_id === id);

  // Recursive component to render the tree
  const TreeNode = ({ nodeId }) => {
  const node = findNodeById(nodeId);

  if (!node) return null; // Exit if no node found
  
  return (
    <div className="flex flex-col items-center" key={node.node_id}>
      {/* Current Node */}
      {
        (node.node_direction)?
          (node.node_direction == "left")?
            <div className="text-[green]">
              <FontAwesomeIcon icon={faArrowDown} className='h-[100px] rotate-[45deg]' />
            </div>
          :
            <div className="text-[green] mr-[150px]">
              <FontAwesomeIcon icon={faArrowDown} className='h-[100px] rotate-[-45deg]' />
            </div>
        :""
      }
      <div className='flex'>
          <div
            className="node bg-[#0e3f60] flex justify-center items-center text-white w-[5vw] h-[5vw] p-[10vh] mb-[2vh]"
            style={{
              borderRadius: "50%",
              border: "1px solid #308e40",
            }}
          >
            {node.node_name}
          </div>
          <div className='node-buttons flex flex-col justify-center ml-[20px]'>
            {(node.left_child_id && node.right_child_id)?
                ""
            :
              <button className='bg-[#079669] text-[white] px-[20px] py-[5px] rounded' onClick={()=>{handleOpenAddModal(node);}}>ADD</button>
            }
            {/* Use onClick={() => setIsAddModalOpen(true)} when you need to pass arguments or delay the execution. else it just executes on render when
            Use onClick={setIsAddModalOpen} when you don’t need to pass arguments and just want to call the function directly. */}
            <br />
            <button className='bg-[yellow] text-[black] px-[20px] py-[5px] rounded' onClick={()=>{handleOpenEditModal(node);}}>EDIT</button>
            <br />
            {(node.parent_id!==null)?  
              <button className='bg-[red] text-[white] px-[20px] py-[5px] rounded' onClick={()=>{handleOpenDeleteModal(node);}}>DELETE</button>
            :""}
          </div>
      </div>
      
      {/* Render Children */}
      <div className="flex space-x-4">
        {/* Render Left Child */}
        {node.left_child_id && <TreeNode nodeId={node.left_child_id} />}
        {/* Render Right Child */}
        {node.right_child_id && <TreeNode nodeId={node.right_child_id} />}
      </div>
    </div>
  );
};

  return (
    <div className="w-screen h-screen bg-black overflow-auto">
    {/* Horizontally scrollable container */}
    <div className="min-w-[100vw] flex justify-center overflow-auto">
      {/* Start rendering from the root node */}
      <TreeNode nodeId={data.find((node) => node.parent_id === null).node_id }/>
    </div>    
    {isAddModalOpen && selectedNode && (
        <AddNodeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAdd}
          parent_id={selectedNode.node_id} // Correct parent ID is passed here
          node_direction={
            selectedNode.left_child_id == null ? 'left' : 'right'
          }
          task_id={selectedNode.task_id}
        />
      )}
      {isEditModalOpen && selectedNodeEdit && (
        <EditNodeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={handleEdit}
          id={selectedNodeEdit.node_id}
        />
      )}
      {isDeleteModalOpen && selectedNodeDelete && (
               
        <DeleteNodeModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDelete}
          id={selectedNodeDelete.node_id}
        />
      )}
  </div>
  );

};

export default page;

// "use client";

// import React, { useEffect, useState } from "react";
// import Loader from "../../../components/Loader"; // Your Loader component
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
// import supabase from "../../../../utils/supabaseClient";
// import AddNodeModal from "./components/AddNodeModal";
// import EditNodeModal from "./components/EditNodeModal";
// import DeleteNodeModal from "./components/DeleteNodeModal";
// import { useParams } from "next/navigation";

// const Page = () => {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [data, setData] = useState([]); // array of objects
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [selectedNodeEdit, setSelectedNodeEdit] = useState(null);
//   const [selectedNodeDelete, setSelectedNodeDelete] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const searchParams = useParams();

//   const handleAdd = async (newName, parent_id, node_direction, task_id) => {
//     const defaultTask = {
//       task_id,
//       node_name: newName,
//       parent_id,
//       left_child_id: null,
//       right_child_id: null,
//       node_direction,
//     };

//     setIsAddModalOpen(false);

//     const response = await fetch("/api/taskboard/add", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(defaultTask),
//     });

//     if (response.ok) {
//       fetchData(); // Refetch data after successful insertion
//     } else {
//       const error = await response.json();
//       console.error("Error adding Node:", error);
//     }
//   };

//   const handleEdit = async (node_id, node_name) => {
//     setIsEditModalOpen(false);

//     const response = await fetch("/api/taskboard/edit", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ node_id, node_name }),
//     });

//     if (response.ok) {
//       fetchData(); // Refetch data after successful update
//     } else {
//       const error = await response.json();
//       console.error("Error Updating Node:", error);
//     }
//   };

//   const handleDelete = async (node_id) => {
//     setIsDeleteModalOpen(false);

//     const response = await fetch("/api/taskboard/delete", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ node_id }),
//     });

//     if (response.ok) {
//       fetchData(); // Refetch data after successful deletion
//     } else {
//       const error = await response.json();
//       console.error("Error Deleting Node:", error);
//     }
//   };

//   const handleOpenAddModal = (node) => {
//     setSelectedNode(node);
//     setIsAddModalOpen(true);
//   };

//   const handleOpenEditModal = (node) => {
//     setSelectedNodeEdit(node);
//     setIsEditModalOpen(true);
//   };

//   const handleOpenDeleteModal = (node) => {
//     setSelectedNodeDelete(node);
//     setIsDeleteModalOpen(true);
//   };

//   const fetchData = async () => {
//     const { data, error } = await supabase
//       .from("taskboard") // Change to your table
//       .select("*")
//       .eq("task_id", searchParams.task_id);

//     if (error) {
//       console.error("Error fetching data:", error);
//     } else {
//       setData(data);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   if (loading) {
//     return <Loader />;
//   }

//   // Helper function to find a node by ID
//   const findNodeById = (id) => data.find((node) => node.node_id === id);

//   // Recursive component to render the tree
//   const TreeNode = ({ nodeId, depth = 0 }) => {
//     const node = findNodeById(nodeId);

//     if (!node) return null;

//     const horizontalSpacing = 200 - depth * 20; // Decrease spacing as depth increases
//     const verticalSpacing = 100;

//     return (
//       <div
//         className="flex flex-col items-center"
//         style={{ marginTop: verticalSpacing }}
//       >
//         {/* Current Node */}
//         <div
//           className="node bg-[#0e3f60] flex justify-center items-center text-white w-[5vw] h-[5vw] p-[10vh] mb-[2vh]"
//           style={{
//             borderRadius: "50%",
//             border: "1px solid #308e40",
//           }}
//         >
//           {node.node_name}
//         </div>

//         {/* Node Actions */}
//         <div className="flex space-x-2 mt-2">
//           <button
//             className="bg-[#079669] text-[white] px-[20px] py-[5px] rounded"
//             onClick={() => handleOpenAddModal(node)}
//           >
//             ADD
//           </button>
//           <button
//             className="bg-[yellow] text-[black] px-[20px] py-[5px] rounded"
//             onClick={() => handleOpenEditModal(node)}
//           >
//             EDIT
//           </button>
//           {node.parent_id !== null && (
//             <button
//               className="bg-[red] text-[white] px-[20px] py-[5px] rounded"
//               onClick={() => handleOpenDeleteModal(node)}
//             >
//               DELETE
//             </button>
//           )}
//         </div>

//         {/* Render Children */}
//         <div
//           className="flex"
//           style={{ justifyContent: "space-between", gap: horizontalSpacing }}
//         >
//           {node.left_child_id && (
//             <TreeNode nodeId={node.left_child_id} depth={depth + 1} />
//           )}
//           {node.right_child_id && (
//             <TreeNode nodeId={node.right_child_id} depth={depth + 1} />
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="w-screen h-screen bg-black overflow-auto">
//       <div
//         className="flex justify-center items-start min-w-[2000vw]"
//         style={{
//           width: "max-content",
//           margin: "0 auto",
//         }}
//       >
//         {/* Start rendering from the root node */}
//         <TreeNode
//           nodeId={data.find((node) => node.parent_id === null).node_id}
//         />
//       </div>
//       {isAddModalOpen && selectedNode && (
//         <AddNodeModal
//           isOpen={isAddModalOpen}
//           onClose={() => setIsAddModalOpen(false)}
//           onAdd={handleAdd}
//           parent_id={selectedNode.node_id}
//           node_direction={
//             selectedNode.left_child_id == null ? "left" : "right"
//           }
//           task_id={selectedNode.task_id}
//         />
//       )}
//       {isEditModalOpen && selectedNodeEdit && (
//         <EditNodeModal
//           isOpen={isEditModalOpen}
//           onClose={() => setIsEditModalOpen(false)}
//           onEdit={handleEdit}
//           id={selectedNodeEdit.node_id}
//         />
//       )}
//       {isDeleteModalOpen && selectedNodeDelete && (
//         <DeleteNodeModal
//           isOpen={isDeleteModalOpen}
//           onClose={() => setIsDeleteModalOpen(false)}
//           onDelete={handleDelete}
//           id={selectedNodeDelete.node_id}
//         />
//       )}
//     </div>
//   );
// };

// export default Page;
