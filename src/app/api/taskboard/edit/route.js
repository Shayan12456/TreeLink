import supabase from '../../../../utils/supabaseClient';  // Make sure you have the correct path to your Supabase client

export async function PATCH(request) {
  try {
    const { node_id, node_name } = await request.json(); // Extract data from request body
    // console.log("directory_id", id, newName)

    if (!node_id || !node_name) {
      return new Response(
        JSON.stringify({ error: "Directory ID and new name are required." }),
        { status: 400 }
      );
    }


    const { data, error } = await supabase
      .from('taskboard')
      .update({ node_name })  // Update the node name
      .match({ node_id }); // Match the node name based on the node_id

    if (error) {
      console.error('Error editing data:', error);
      return new Response(
        JSON.stringify({ error: 'Error editing data' }),
        { status: 500 }
      );
    }

    console.log('Data edited:', data);
    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Unexpected error occurred' }),
      { status: 500 }
    );
  }
}