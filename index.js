require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");

const app = express();
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@certificatesheet.k7w7rea.mongodb.net/test`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Mongodb connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.get("/", (req, res) => {
  res.send("Hello to Memories API");
});

connectDB();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is running on ${port}`);
});
