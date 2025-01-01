import jwt from "jsonwebtoken";
import supabase  from "../../../utils/supabaseClient.js"; // Replace with your Supabase client
const SECRET_KEY = "your_secret_key";

export default async function GET(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the JWT
    const decoded = jwt.verify(token, SECRET_KEY);

    // Fetch data from Supabase
    const { data, error } = await supabase
      .from('users')
      .select('email, username');

    if (error) {
      return res.status(500).json({ message: "Database error", error });
    }

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
