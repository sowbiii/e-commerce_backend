const Order=require('../models/orderModel')
const Cart=require('../models/cartModel')
const Product=require('../models/productModel')
const { v4: uuidv4 } = require('uuid');

exports.createOrder = async (req, res) => {
    const { user_id ,email} = req.user;
    try {
        const { name, address, phno } = req.body;

        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart Not Found' });
        }
        const order = new Order({
            order_id:uuidv4(),
            name,
            address,
            phno,
            products: cart.products,
            order_date: new Date(),
            delivery_date: calculateDeliveryDate(), 
            email:email
        });
        await order.save();
        await Cart.deleteOne({ user_id });
        res.status(201).json({ message: 'Order created successfully' });
    } catch (err) {
        console.error('Error occurred while creating order:', err.message);
        res.status(500).json({ message: 'An error occurred while creating the order' });
    }
};

function calculateDeliveryDate(){
    const today = new Date();
    return new Date(today.setDate(today.getDate()+7));
}


exports.getOrder = async (req, res) => {
    const { order_id } = req.params;  

    try {
        const order = await Order.findOne({ order_id });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const products = await Promise.all(
            order.products.map(async (prod) => {
                const productDetails = await Product.findById(prod.product_id);
                return {
                    product_id: prod.product_id,
                    title: productDetails.title,
                    price: productDetails.price,
                    quantity: prod.quantity,
                    description: productDetails.description,
                    image: productDetails.image
                };
            })
        );

        res.status(200).json({
            ...order._doc,  
            products
        });
    } catch (err) {
        console.error('Error occurred while fetching orders:', err.message);
        res.status(500).json({ message: 'An error occurred while fetching orders' });
    }
};
