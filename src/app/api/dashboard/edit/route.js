import supabase from '../../../../utils/supabaseClient';  // Make sure you have the correct path to your Supabase client

export async function PATCH(request) {
  try {
    const { id, newName } = await request.json(); // Extract data from request body
    console.log("directory_id", id, newName)

    if (!id || !newName) {
      return new Response(
        JSON.stringify({ error: "Directory ID and new name are required." }),
        { status: 400 }
      );
    }


    const { data, error } = await supabase
      .from('directories')
      .update({ directory_name: newName })  // Update the directory name
      .match({ directory_id: id }); // Match the row based on the directory_id

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