// const express = require("express"); // "type": "commonjs"
import express from "express"; // "type": "module"
import { MongoClient } from "mongodb";
import moviesRouter from './routes/movies.route.js'
import userRouter from './routes/users.route.js'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import cors from 'cors';



const app = express();

const PORT = 4001;
       
// const MONGO_URL = "mongodb://127.0.0.1";

const MONGO_URL = process.env.MONGO_URL
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("MongDB connected");

app.use(express.json())
app.use(cors())
app.use("/bookmyshow", moviesRouter)
app.use('/users', userRouter)


app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩"); 
});


app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

export {client}