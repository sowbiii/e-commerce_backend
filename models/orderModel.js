const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
    order_id:String,
    name:String,
    address:String,
    phno:Number,
    email:String,
    products:[
        {
            product_id:{type:String},
            quantity:Number
        }
    ],
    order_date:{ type: Date, default: Date.now },
    delivery_date:Date,
    email:String
})

const Order=mongoose.model('Order',orderSchema);
module.exports=Order;