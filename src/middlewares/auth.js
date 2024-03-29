const User= require("../models/user")
const jwt = require('jsonwebtoken')
const auth = async (req,res,next)=>
{

    try{
        const token=req.cookies['auth-key'] 
          
        const data=jwt.verify(token,"123456")
    
        const user=await User.findOne({_id:data._id, "tokens.token":token})
        if(user.confirmed ===false )
        {
           throw new Error("Please Verify yout Email Address")  
        }
       if(!user)
       {
         throw new Error()
       }
       req.user=user
       next()
   
   }
   catch(e)
   {
    res.send({"error":"Please Authenticate"})
   }

}

module.exports= auth 