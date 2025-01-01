import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key"; // Store securely in .env

//500 + async
export async function POST(req) {
    const { email, password } = await req.json();

    // Dummy user for validation (replace with database lookup)
    const user = {
      email: "user1@gmail.com",
      password: "p", // In real-world, passwords should be hashed
    };

    if (email === user.email && password === user.password) {
      // Generate JWT
      const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });

      // return res.status(200).json({ token });
      return new Response(
        JSON.stringify({ token }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );

    }

    // return res.status(401).json({ message: "Invalid credentials" });

}


// import jwt from "jsonwebtoken";

// const SECRET_KEY = "your_secret_key"; // Use an environment variable for production

// export async function POST(req) {
//   try {
//     const body = await req.json(); // Parse the request body (new in App Directory)
//     const { email, password } = body;

//     // Dummy user validation (replace with real database lookup)
//     const user = {
//       email: "user1@gmail.com",
//       password: "p", // Use hashed passwords in production
//     };

//     if (email === user.email && password === user.password) {
//       // Generate JWT
//       const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });

//       return new Response(
//         JSON.stringify({ token }),
//         { status: 200, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     return new Response(
//       JSON.stringify({ message: "Invalid credentials" }),
//       { status: 401, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ message: "Server error" }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }
