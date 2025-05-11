import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express()

app.listen(process.env.PORT, () => {
  console.log("Example app listening on port 4500")
})
