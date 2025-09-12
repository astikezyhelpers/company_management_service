import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
let PORT = process.env.PORT;
app.listen(PORT, (err) => {
  console.log(`Server is running on port http://localhost:${PORT}/api/company`);
  if (err) {
    console.log(err.message);
  }
});