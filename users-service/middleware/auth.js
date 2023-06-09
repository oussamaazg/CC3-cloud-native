const jwt=require("jsonwebtoken")
require("dotenv").config()

function verifyToken(req,res,next){
    const authHeaders = req.headers['Authorization'];
    const token =authHeaders && authHeaders.split(' ')[1];
    
    if(!token) res.status(403).json({message: "A token is required for authentication"})
    cle_secrete=process.env.cle_secret

    jwt.verify(token,cle_secrete,(err,data)=>{
        if(err) return res.status(401).json({message :"invalid token"})
         
        req.user=data
        next()
    })
}
module.exports=verifyToken

