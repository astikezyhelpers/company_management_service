import dotenv from "dotenv";
import logger from "./logger.js";
dotenv.config();
import app from "./app.js";
let PORT = process.env.PORT;
app.listen(PORT, (err) => {
  logger.info(`Server is running on port http://localhost:${PORT}/api/company`);
  if (err) {
    logger.error(err.message);
  }
});