import supabase from '../../../../utils/supabaseClient';

export async function DELETE(request) {
    try {
      const { id } = await request.json();
  
      // Delete directory based on id
      const { data, error } = await supabase
        .from('directories')
        .delete()
        .match({ directory_id: id });
  
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }
  
      return new Response(JSON.stringify({ message: 'Directory deleted', data }), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Failed to delete directory' }), { status: 500 });
    }
  }
  
  export async function PATCH(request) {
    try {
      const { id, directory_name } = await request.json();
  
      // Update directory name
      const { data, error } = await supabase
        .from('directories')
        .update({ directory_name })
        .match({ directory_id: id });
  
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }
  
      return new Response(JSON.stringify({ message: 'Directory updated', data }), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Failed to update directory' }), { status: 500 });
    }
  }
  