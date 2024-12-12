import supabase from '../../../../utils/supabaseClient';

// Recursive delete function
export async function deleteNodeRecursively(nodeId) {
  try {
    // Fetch the node with the given node_id
    const { data: nodeData, error: fetchError } = await supabase
      .from('taskboard')
      .select('*')
      .eq('node_id', nodeId)
      .single() // Get a single record

    if (fetchError) {
      throw new Error(`Error fetching node: ${fetchError.message}`);
    }

    if (!nodeData) {
      console.error(`Node not found for ID: ${nodeId}`);
      return;
    }

    // Recursively delete left child
    if (nodeData.left_child_id) {
      await deleteNodeRecursively(nodeData.left_child_id);
    }

    // Recursively delete right child
    if (nodeData.right_child_id) {
      await deleteNodeRecursively(nodeData.right_child_id);
    }

    // Delete the current node
    const { error: deleteError } = await supabase
      .from('taskboard')
      .delete()
      .eq('node_id', nodeId);

    // Delete the current node's reference from parent via updating it to null
      // Fetch the parent's current data
    const { data: parentNode, error: fetchParentError } = await supabase
    .from('taskboard')
    .select("*") // Dynamically select left_child_id or right_child_id
    .eq('node_id', nodeData.parent_id)
    .single(); // Ensure we get only one record

    if (fetchParentError) {
      console.error('Error fetching parent node:', fetchParentError);
      return;
    }

    let updateData = {};
    if (nodeData.node_direction === "left") {
      updateData = {
        left_child_id: parentNode.right_child_id, // Shift right_child_id to left_child_id
        right_child_id: null // Clear the right_child_id
      };
      console.log(parentNode)
      const { data: res } = await supabase
      .from('taskboard')
      .update({node_direction: "left"})
      .eq('node_id', updateData.left_child_id);
    } else {
      updateData = {
        right_child_id: null // Clear only the right_child_id
      };
    }


    // Update the parent's child reference to null
    const { error: updateError } = await supabase
    .from('taskboard')
    .update(updateData) // Dynamically clear left_child_id or right_child_id
    // nodeData.node_direction=="left"?[`${nodeData.node_direction}_child_id`]=parentNode.right_child_id;parentNode.right_child_id=null:[`${nodeData.node_direction}_child_id`]= null
    .eq('node_id', nodeData.parent_id); // Match the parent node by its ID

    if (updateError) {
    console.error('Error updating parent node reference:', updateError);
    } else {
    console.log(`Parent node ${nodeData.parent_id} updated successfully.`);
    }

    if (deleteError) {
      throw new Error(`Error deleting node: ${deleteError.message}`);
    }

    console.log(`Node successfully deleted: ${nodeId}`);
  } catch (err) {
    console.error(`Error during recursive deletion: ${err.message}`);
    throw err;
  }
}

// CRUD DELETE Handler
export async function DELETE(request) {
  try {
    const { node_id } = await request.json();

    if (!node_id) {
      return new Response(JSON.stringify({ error: 'Node ID is required' }), {
        status: 400,
      });
    }

    await deleteNodeRecursively(node_id);

    return new Response(
      JSON.stringify({ message: `Node ${node_id} and its children deleted successfully` }),
      { status: 200 }
    );
  } catch (err) {
    console.error(`Error during DELETE request: ${err.message}`);
    return new Response(
      JSON.stringify({ error: 'Failed to delete node and its children' }),
      { status: 500 }
    );
  }
}
