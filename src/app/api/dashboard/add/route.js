import supabase from '../../../../utils/supabaseClient';

// Handler function for CRUD operations
export async function POST(request) {
  try {
    const { user_id, directory_name } = await request.json();

    // Insert new directory into the database
    const { data, error } = await supabase
      .from('directories')
      .insert([{ user_id, directory_name }])
      .select('*'); // Ensure we get the directory_id

      // console.log(data[0].task_id)
      const task_id = data[0].task_id; // Get the newly created directory ID

      const defaultTask = {
        task_id,
        node_name: "Start",
        parent_id: null,
        left_child_id: null,
        right_child_id: null,
        node_direction: null,
      };
  
      const result = await supabase
      .from('taskboard')
      .insert([defaultTask]);
      // console.log(result)

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: 'Directory added', data }), { status: 201 });
  } catch (err) {
    console.log(err)
    return new Response(JSON.stringify({ error: 'Failed to add directory' }), { status: 500 });
  }
}