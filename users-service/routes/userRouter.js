const express = require('express')

const router = express.Router()

const userModel = require('../models/userModel')

router.post('/create-user', (req, res) => {
    const {email,name,password,_id}=req.body;

    bcrypt.genSalt(10,(err,salt)=>{
        if(err) 
            return res.status(404).json({message :"error generate salt"})
        bcrypt.hash(password,salt,(err,hash)=>{
            if(err) 
                return res.status(404).json({message :"error generate hash"})

        const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            password:hash,
            _id: req.body._id,
        })

    user.save((err, user) => {
        if (err) {
            res.status(400).send({ error : err})
        } else {
            res.status(200).send({ data: user})
        }
            })
        })
    })
})

routes.post('/login-user', (req, res) => {
    const {email,password} =req.body
    if(!email || !password)
        return res.status(507).json({message : "remplir tous les champs"})
    
    userModel.findOne({email},(err,user)=>{
        if(err) return res.status(404).json("user not found")
        bcrypt.compare(password,user.password,(err,result)=>{
            if(err) return res.status(404).json({message :"err de comparaison"})

            if(result) res.status(202).json("authentification réssie") 
            else res.status(202).json("authentification echoué")
        })
    const cle_secrete=process.env.cle_secret

    jwt.sign(user,cle_secrete,(err,token)=>{
        if(err) res.status(507).json(" error generate token ")
        else res.json({token})
    })
    })

    
})
module.exports = router