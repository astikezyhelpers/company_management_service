import app from "./app.js";
app.listen(process.env.PORT, (err) => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}/api/company`);
  if (err) {
    console.log(err.message);
  }
});