import express from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import problemRoutes from "./routes/problem.route.js";
import executionRoutes from "./routes/executionCode.route.js";
import submissionRoutes from "./routes/submission.route.js";
import playlistRoutes from "./routes/playlistRoutes.route.js";

dotenv.config();

const app = express()


app.use(express.json());
app.use(cookieparser());

app.get("/", (req, res) => {

  res.send ("Hii wellcome to Hardcode");

})
app.get('/Adi', (req, res) => {
  res.send('Hello World!')
})

app.use ("/api/v1/auth", authRoutes)
app.use ("/api/v1/problems",problemRoutes)
app.use ("/api/v1/execute-code", executionRoutes)
app.use ("/api/v1/submission", submissionRoutes)
app.use("/api/v1/playlist", playlistRoutes);



app.listen(process.env.PORT, () => {
  console.log("Example app listening on port 4500")
})
