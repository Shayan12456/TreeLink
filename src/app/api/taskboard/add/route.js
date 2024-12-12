import supabase from '../../../../utils/supabaseClient';

// Handler function for CRUD operations
export async function POST(request) {
  try {
    const requestedData = await request.json();
    console.log("requestedData", requestedData)
    // Insert new node into the database
    const { data, error } = await supabase
      .from('taskboard')
      .insert([requestedData])
      .select("*")
      

  // Get the parent_id from the inserted task
  const parentId = data[0].parent_id;
  const nodeId = data[0].node_id; // The node_id of the newly inserted node

   // Fetch left_child_id and right_child_id of the parent node
   const { data: newData, error: fetchError } = await supabase
   .from('taskboard')
   .select('left_child_id, right_child_id')  // Select specific columns
   .eq('node_id', parentId);  // Match the parent using node_id


  // If there's an error fetching the parent's data
  if (fetchError) {
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 400 });
  }

      
    // Logic to update the parent's left_child_id or right_child_id
    const parentNode = newData[0];
    if (parentNode.left_child_id === null) {
      // If left_child_id is null, assign nodeId to left_child_id
      const { updateError } = await supabase
        .from('taskboard')
        .update({ left_child_id: nodeId })
        .eq('node_id', parentId);  // Update the parent node

      if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), { status: 400 });
      }
    } else if (parentNode.right_child_id === null) {
      // If left_child_id is not null, but right_child_id is null, assign nodeId to right_child_id
      const { updateError } = await supabase
        .from('taskboard')
        .update({ right_child_id: nodeId })
        .eq('node_id', parentId);  // Update the parent node

      if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), { status: 400 });
      }
    }

      return new Response(JSON.stringify({ message: 'Node added', data }), { status: 201 });
    } catch (err) {
      console.log(err)
      return new Response(JSON.stringify({ error: 'Failed to add Node' }), { status: 500 });
    }
  }