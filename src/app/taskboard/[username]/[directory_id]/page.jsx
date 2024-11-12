"use client"

import React, { useEffect, useState } from 'react'
import supabase from '../../../utils/supabaseClient';
import Loader from '../../../components/Loader';  // Your Loader component
// import { useParams } from 'next/navigation';

const page = () => {
  // const { directory_id } = useParams();  // Access the dynamic parameter
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('taskboard') // Change to your table 
      .select("*") // Select fields from both tables

      console.log('Fetched data:', data);
      setData(data)
      setLoading(false);
  }

  useEffect(fetchData, [])

  if (loading) {
    return <Loader />;  // Show the loader until data is fetched
  }

  // Group tasks by parent_id
  const groupedTasks = data.reduce((acc, task) => {
    if (task.parent_id !== "NULL") {
      if (!acc[task.parent_id]) {
        acc[task.parent_id] = [];
      }
      acc[task.parent_id].push(task);
    }
    return acc;
  }, {});

  return (
    <div className='w-screen h-screen bg-black' style={{display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center", overflow: "scroll"}}>
      <div className="nodeandbuttons" style={{display: "flex"}}>
        <div className="node" style={{backgroundColor: "#0e3f60", display: "flex", justifyContent:"center", alignItems:"center", color:"white", width: "5vw", height:"5vw", borderRadius:"50%" ,padding: "10vh", border: "1px solid #308e40", marginRight: "1vw"}}>
          {data.filter((node)=>node.parent_id == "NULL")[0].node_name}
        </div>

        <div className="node-buttons" style={{display: "flex", flexDirection: "column"}}>
          <button style={{backgroundColor: "#5b3164", border: "1px solid white", color: "white", padding: "1vh 3vw", borderRadius: "10px"}}>ADD</button>
          <br />
          <button style={{backgroundColor: "#5b3164", border: "1px solid white", color: "white", padding: "1vh 3vw", borderRadius: "10px"}}>EDIT</button>
        </div>
      </div>
      {/* {
        data.filter((node)=>node.parent_id != "NULL").forEach(task => {
          return (
            <>
              <div className="node" style={{backgroundColor: "#0e3f60", display: "flex", justifyContent:"center", alignItems:"center", color:"white", width: "5vw", height:"5vw", borderRadius:"50%" ,padding: "10vh", border: "1px solid #308e40", marginRight: "1vw"}}>
                {task.node_name}
              </div>
              <div className="node-buttons" style={{display: "flex", flexDirection: "column"}}>
                <button style={{backgroundColor: "#5b3164", border: "1px solid white", color: "white", padding: "1vh 3vw", borderRadius: "10px"}}>ADD</button>
                <br />
                <button style={{backgroundColor: "#5b3164", border: "1px solid white", color: "white", padding: "1vh 3vw", borderRadius: "10px"}}>EDIT</button>
              </div>
            </>
          );
        })
      } */}
{/* Render tasks grouped by parent_id */}
{Object.keys(groupedTasks).map((parentId) => (
        <div key={parentId} style={{ display: "flex", marginBottom: "2vh" }}>
          {groupedTasks[parentId].map((task, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "1vh" }}>
              <div className="node" style={{
                backgroundColor: "#0e3f60", display: "flex", justifyContent: "center", alignItems: "center", color: "white", width: "5vw", height: "5vw", borderRadius: "50%",
                padding: "10vh", border: "1px solid #308e40", marginRight: "1vw"
              }}>
                {task.node_name}
              </div>
              <div className="node-buttons" style={{ display: "flex", flexDirection: "column" }}>
                <button style={{
                  backgroundColor: "#5b3164", border: "1px solid white", color: "white", padding: "1vh 3vw", borderRadius: "10px", marginBottom: "1vh"
                }}>ADD</button>
                <button style={{
                  backgroundColor: "#5b3164", border: "1px solid white", color: "white", padding: "1vh 3vw", borderRadius: "10px"
                }}>EDIT</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default page