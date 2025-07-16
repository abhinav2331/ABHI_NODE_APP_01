import express from "express";
import {db} from "./db.js";
import userRouter from './routes/user.js';
import blogRouter from './routes/blog.js';

const app = express();
app.use(express.json());
const port = 4200;


// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL=====>:', err);
    return;
  }
  console.log('Connected to MySQL database===>');
});

app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});