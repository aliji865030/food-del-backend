import mongoose from "mongoose"

export const connectDB= async ()=>{
    await mongoose.connect("mongodb+srv://abbasalichand786:N9jFI4RU5Qw4DkQ9@cluster0.ukl8zry.mongodb.net/food-del")
    .then(()=>console.log("DB connect success"))
    .catch((error)=>console.log("ERROR while connecting DB"))
}