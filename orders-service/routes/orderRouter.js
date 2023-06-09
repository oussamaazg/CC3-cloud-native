const express = require('express')

const router = express.Router()
const amqp=require('amqplib')
const Order = require('./models/orderModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (orderItems) => {
    const initialValue = 0;
    const itemsPrice = orderItems.reduce(
        (previousValue, currentValue) =>
        previousValue + currentValue.price * currentValue.amount, initialValue
    );
    return itemsPrice * 10;
}

let connection ,channel ;
const queueName1="queue from order"
const queueName2="queue from product"

async  function connectToRabbitMQ(){
    const amqpserver = "amqp://guest:guest@/rabbitmq:5672"
    connection = amqp.connect(amqpserver)
    channel = connection.createChannel()
    await channel.assertQueue(queueName1)
    await channel.assertQueue(queueName2)
}

app.post('/create-order', async(req, res) => {
    connectToRabbitMQ().then(() => {
        channel.consume(queueName1, (data) => {
            const { orderItems, shippingAddress, userId } = req.body;
            console.log(shippingAddress);

            const totalPrice = calculateOrderAmount(orderItems);

            const taxPrice = 0;
            const shippingPrice = 0;

            const order = new Order({
                orderItems,
                shippingAddress,
                paymentMethod: 'stripe',
                totalPrice,
                taxPrice,
                shippingPrice,
                user: ''
            })

          order.save().then((ord)=> {
            channel.sendToQueue(queueName2, Buffer.from(JSON.stringify(ord)))
          });
  
          
          channel.ack(data);;

        const paymentIntent =  stripe.paymentIntents.create({
            amount: totalPrice,
            currency: 'DH'
        })

        res.send({
            clientSecret: paymentIntent.client_secret
        })
    })
})
})


module.exports = router