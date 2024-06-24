import foodModel from "../models/foodModel.js";
import fs from "fs"



// add food item

const addFood= async (req,res)=>{

    let image_filename=`${req.file.filename}`
    console.log(image_filename);
    console.log("file ",req.file);

    const food=new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename,
    })

    try {
        await food.save()
        res.json({
            success:true,
            message:"food added"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"ERROR"
        })
    }
}


// all food list

const listFood=async (req,res)=>{

    try {
        const foods=await foodModel.find({})
        res.json({
            success:true,
            result:foods
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"ERROR"
        })
    }
}


// remove food item

const removeFood=async (req,res)=>{

    try {
        const food=await foodModel.findById(req.body.id)
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({
            success:true,
            message:"Food Removed"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"ERROR"
        })
    }
}

export {addFood,listFood,removeFood}