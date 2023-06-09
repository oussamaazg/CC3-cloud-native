const express = require('express')
const amqp = require('amqplib')
const router = express.Router()

const Product = require('../models/productModel')
let connection ;  
let channel ;

const queueName1="order-service-queue"
const queueName2="produit-service-queue"

async function connectToRabbitMQ(){
    const amqpserver="amqp//ussm:ussm@/rabbitmq:5672"
    const connection = amqp.connect(amqpserver)
    const channel = connection.createChannel()
    await channel.assertQueue(queueName1)
    await channel.assertQueue(queueName2)
}

connectToRabbitMQ()


router.get('/products', async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).send({ data: products})
    } catch (err) {
        res.status(400).send({ error: err})
    }
})

router.get('/products-by-categories', async(req, res) => {
    try {
        const products = await Product.aggregate([
            { $match: {}},
            { $group: {
                _id: '$category',
                products: { $push: '$$ROOT'}
            }},
            { $project: { name: '$_id', products: 1, _id: 0}}
        ])
        res.status(200).send({ data: products})
    } catch (err) {
        res.status(400).send({ error: err})
    }
})

routes.post('/makeorder',(req,res)=>{
    Product.find({_id :{$in: req.body}},(err,listprod)=>{
        if(err || listprod==null)
            return res.json({message: "list empty"})
        else
        channel.sendToQueue(queueName1,Buffer.from(JSON.stringify(listprod)))
        channel.consume(queueName2,(data)=>{
            res.json(JSON.parse(data.content.toString()))
        })
    })
})

module.exports = router