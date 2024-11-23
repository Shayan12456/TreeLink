"use client"

import React, { useEffect, useState } from 'react'
import supabase from '../../../utils/supabaseClient';
import Loader from '../../../components/Loader';  // Your Loader component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

const page = () => {
  const [data, setData] = useState([]);  // array of objects
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('taskboard') // Change to your table 
      .select("*");

    setData(data);
    setLoading(false);
  }

  useEffect(fetchData, [])

  if (loading) {
    return <Loader />;  // Show the loader until data is fetched
  }

// Group tasks by parent_id and organize them into left and right children
  const groupedTasks = data.reduce((acc, task) => {
    if (task.parent_id !== "NULL") {
      if (!acc[task.parent_id]) {
        acc[task.parent_id] = { left: null, right: null };
      }
      if (task.node_direction === "left") {
        acc[task.parent_id].left = task;
      } else if (task.node_direction === "right") {
        acc[task.parent_id].right = task;
      }
    }
    return acc;
  }, {});

  // Function to render a node and its left and right children recursively

  const renderNode = (task, index) => {
    // Get the current node's children based on the groupedTasks object
    const children = groupedTasks[task.node_id] || { left: null, right: null };
  
    return (
      <div className="flex flex-col items-center" key={index}>
  {/* Current Node */}
  <div className='flex items-center justify-center'>
    <div className='flex flex-col justify-center items-center'>
      

      <div
        className="node bg-[#0e3f60] flex justify-center items-center text-white w-[5vw] h-[5vw] mr-[1vw] p-[10vh]"
        style={{
          borderRadius: "50%",
          border: "1px solid #308e40",
        }}
      >
        {task.node_name}
      </div>
      {/* Arrow Indicator */}
      <div className="text-[green]">
        <FontAwesomeIcon icon={faArrowDown} className='h-[10px] rotate-[45deg]' />
      </div>
    </div>
  </div>

  {/* Left and Right Children */}
  <div className="flex mx-auto w-full justify-between">
    {/* Render Left Child */}
    {children.left && renderNode(children.left, `${index}-left`)}
    {/* Render Right Child */}
    {children.right && renderNode(children.right, `${index}-right`)}
  </div>
</div>

    );
  };

  return (
    <div
      className="w-screen h-screen bg-black flex flex-col justify-center items-center"
      style={{
        overflowY: "scroll",
      }}
    >
      {/* Render root node and its children */}
      {data
        .filter((node) => node.parent_id === "NULL")
        .map((task, index) => renderNode(task, index))}
    </div>
  );
};

export default page;