import supabase from '../../../../utils/supabaseClient';

// Handler function for CRUD operations
export async function GET(request) {
  try {
    // Fetch directories for the user
    const { data, error } = await supabase
      .from('directories')
      .select('*');

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
  }
}