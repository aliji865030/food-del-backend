

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing order from frontend
const placeOrder = async (req, res) => {
    console.log("Request received:", req.body);
    
    const frontend_url = "https://localhost:4000";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery charges"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",  // Corrected parameter
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
            // success_url: `${frontend_url}/myorders`,
            // cancel_url: `${frontend_url}/myorders`
        });

        res.json({
            success: true,
            session_url: session.url
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "ERROR"
        });
    }
};

const verifyOrders = async (req, res) => {
    const { orderId, success } = req.query; // Assuming you are using query params
  
    try {
      if (success === "true") {
        await orderModel.findByIdAndUpdate(orderId, { payment: true });
        res.json({
          success: true,
          message: "Paid"
        });
      } else {
        await orderModel.findByIdAndDelete(orderId); // Fixed the deletion call
        res.json({
          success: false,
          message: "Not paid"
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: "ERROR"
      });
    }
  };
  

// users order for frontend

const userOrders=async(req,res)=>{
    try {
        const orders=await orderModel.find({userId:req.body.userId})
        res.json({
            success:true,
            data:orders
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"ERROR"
        })
        
    }
}

// listing orders for admin panel

const listOrders= async (req,res)=>{
    try {
        const orders=await orderModel.find({})
        res.json({
            success:true,
            data:orders
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"ERROR"
        })
    }
}

// api for updating order satatus

const updateStatus = async (req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({
            success:true,
            message:"Status updated"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"ERROR"
        })
    }
}

export { placeOrder,verifyOrders,userOrders,listOrders,updateStatus };
