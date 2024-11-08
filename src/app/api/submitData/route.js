// src/app/api/submitData/route.js
export async function POST(req) {
    const body = await req.json();  // Parse the JSON body
    console.log(body);  // Log the entire body
    return new Response(JSON.stringify({ message: 'Data received' }), {
        status: 200,
    });
}
