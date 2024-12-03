"use client"

import React, { useEffect, useState } from 'react'
import Loader from '../../../components/Loader';  // Your Loader component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import supabase from '../../../../utils/supabaseClient';

const page = () => {
  const [data, setData] = useState([]);  // array of objects
  const [loading, setLoading] = useState(true);
  
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('taskboard') // Change to your table 
      .select("*");

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

// Group tasks by parent_id and organize them into left and right children
//   const groupedTasks = data.reduce((acc, task) => {
//     if (task.parent_id !== "NULL") {
//       if (!acc[task.parent_id]) {
//         acc[task.parent_id] = { left: null, right: null };
//       }
//       if (task.node_direction === "left") {
//         acc[task.parent_id].left = task;
//       } else if (task.node_direction === "right") {
//         acc[task.parent_id].right = task;
//       }
//     }
//     return acc;
//   }, {});

//   // Function to render a node and its left and right children recursively

//   const renderNode = (task, index) => {
//     // Get the current node's children based on the groupedTasks object
//     const children = groupedTasks[task.node_id] || { left: null, right: null };
  
//     return (
//       <div className="flex flex-col items-center" key={index}>
//   {/* Current Node */}
//   <div className='flex items-center justify-center'>
//     <div className='flex flex-col justify-center items-center'>
      

//       <div
//         className="node bg-[#0e3f60] flex justify-center items-center text-white w-[5vw] h-[5vw] mr-[1vw] p-[10vh]"
//         style={{
//           borderRadius: "50%",
//           border: "1px solid #308e40",
//         }}
//       >
//         {task.node_name}
//       </div>
//       {/* Arrow Indicator */}
//       {/* <div className="text-[green]">
//         <FontAwesomeIcon icon={faArrowDown} className='h-[10px] rotate-[45deg]' />
//       </div> */}
//     </div>
//   </div>

//   {/* Left and Right Children */}
//   <div className="flex mx-auto w-full justify-center">
//     {/* Render Left Child */}
//     {children.left && renderNode(children.left, `${index}-left`)}
//     {/* Render Right Child */}
//     {children.right && renderNode(children.right, `${index}-right`)}
//   </div>
// </div>

//     );
//   };

// const testData = [
//   {
//     node_id: "1",
//     parent_id: null,
//     node_name: "Node 1",
//     left_child_id: "2",
//     right_child_id: "3",
//     node_direction: null
//   },
//   {
//     node_id: "2",
//     parent_id: "1",
//     node_name: "Node 2",
//     left_child_id: "4",
//     right_child_id: "5",
//     node_direction: "left"
//   },
//   {
//     node_id: "3",
//     parent_id: "1",
//     node_name: "Node 3",
//     left_child_id: "6",
//     right_child_id: "7",
//      node_direction: "right"
//   },
//   {
//     node_id: "4",
//     parent_id: "2",
//     node_name: "Node 4",
//     left_child_id: null,
//     right_child_id: null,
//     node_direction: "left"
//   },
//   {
//     node_id: "5",
//     parent_id: "2",
//     node_name: "Node 5",
//     left_child_id: null,
//     right_child_id: null,
//     node_direction: "right"
//   },
//   {
//     node_id: "6",
//     parent_id: "3",
//     node_name: "Node 6",
//     left_child_id: null,
//     right_child_id: "8",
//     node_direction: "left"
//   },
//   {
//     node_id: "7",
//     parent_id: "3",
//     node_name: "Node 7",
//     left_child_id: null,
//     right_child_id: null,
//     node_direction: "right"
//   },
//   {
//     node_id: "8",
//     parent_id: "6",
//     node_name: "Node 8",
//     left_child_id: "9",
//     right_child_id: null,
//     node_direction: "left"
//   },
//   {
//     node_id: "9",
//     parent_id: "8",
//     node_name: "Node 9",
//     left_child_id: null,
//     right_child_id: null,
//     node_direction: "left"
//   },
// ];

// Helper function to find a node by ID
const findNodeById = (id) => data.find((node) => node.node_id === id);

// Recursive component to render the tree
const TreeNode = ({ nodeId }) => {
  const node = findNodeById(nodeId);

  if (!node) return null; // Exit if no node found
  {console.log(data[0].task_id)}
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
            <div className="text-[green] mr-[55%]">
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
            <button className='bg-[red] text-[white] px-[20px] py-[10px] rounded'>ADD</button>
            <br />
            <button className='bg-[red] text-[white] px-[20px] py-[10px] rounded'>EDIT</button>
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
      {/* {console.log(data[0].task_id)} */}
    {/* Horizontally scrollable container */}
    <div className="min-w-[150vw] flex justify-center">
      {/* Start rendering from the root node */}
      <TreeNode nodeId={data[0].node_id} />
    </div>
  </div>
  );

};

export default page;