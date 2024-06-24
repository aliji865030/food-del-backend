import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoutes.js";
import "dotenv/config.js"
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";



// app config

const app=express();
const port=4000;


// middleware

app.use(express.json())

const corsOptions = {
    origin: ["http://localhost:5173", "https://taste-trekker.vercel.app"],
    optionsSuccessStatus: 200,
  };
  
  app.use(cors(corsOptions));

// db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static("uploads"))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)


app.get("/",(req,res)=>{
    res.send("API working")
})

app.listen(port,()=>console.log(`App is up and running on port number ${port}`))

