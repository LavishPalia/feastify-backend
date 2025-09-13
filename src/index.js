import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

app.listen(port, async () => {
  await connectDB();

  console.log(`Server listening on port ${port}`);
});
