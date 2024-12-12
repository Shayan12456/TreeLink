import supabase from '../../../../utils/supabaseClient';

export async function DELETE(request) {
    try {
      const { id } = await request.json();
  

         // Delete task based on id
         const { data: taskData, error: taskError } = await supabase
         .from('taskboard')
         .delete()
         .match({ task_id: id });
  
         
      // Delete directory based on id
      const { data, error } = await supabase
        .from('directories')
        .delete()
        .match({ task_id: id });

      
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }
  
      return new Response(JSON.stringify({ message: 'Directory deleted', data }), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Failed to delete directory' }), { status: 500 });
    }
  }
