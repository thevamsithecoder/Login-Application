const express = require("express");
const app = express(); 
const dotenv = require("dotenv"); //to store the sensitive data 
const connectDB = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const path = require("path");

dotenv.config()

//middlewares
app.use(cors())

app.use(express.json()) //enableing json so that we send the data in the form of json
app.use(express.static(path.join(__dirname, "./Client/dist")));


app.use("/api/v1/auth", authRoutes);

app.use("*", function(req,res) {
  res.sendFile(path.join(__dirname, "./Client/dist/index.html"))
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=> {
  console.log(`Server running on ${PORT}`);
})

connectDB();