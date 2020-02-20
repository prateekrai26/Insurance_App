let express= require("express")
const router = express.Router();
const User= require("../models/user")
const auth = require('../middlewares/auth')
const cookieParser= require('cookie-parser')
router.use(cookieParser())
const products = require("../models/product")
const Emails = require("../middlewares/email")
const jwt = require("jsonwebtoken")

var flash = require('express-flash')
var session = require('express-session')
  router.use(session({
       secret:'Hello',
       resave:false,
       saveUninitialized:true
   }))
 router.use(flash())

router.get("/signup",(req,res)=>
{
  res.render("signup");
})
router.get("/login",(req,res)=>
{
  res.render("login");
})

router.get("/profile", auth , async (req,res)=>
{

//   await req.user.populate({
//     path:"tasks",
//     options:
//     {
//         limit:parseInt(req.query.limit),
//         skip:parseInt(req.query.skip),
//     }
// }).execPopulate()

//         console.log(req.user.tasks)
let prod=undefined;
  const product= products.find({owner : req.user._id},(err,resu)=>
  {
    const data = {
      name  : req.user.name ,
      age :req.user.age  ,
      phone : req.user.phone ,
      email : req.user.email,
      products:resu
      
    }
  console.log(data)
    res.render('profile',data)

  })
  
    
})
router.get("/calculatePremium",(req,res)=>
{
  res.render("calculate")
})
router.get("/apply", async (req,res)=>
{
  res.render("apply")
})

router.post("/apply",auth,  async (req,res)=>
{

  const Product=await new products(
    {
        ...req.body,
        owner:req.user._id
    }
);
   Product.save()
    res.redirect("/profile")
})


router.get("/logout", async  (req,res)=>{
  res.cookie('auth-key',undefined)
  res.redirect('/')
})

router.get("/confirm/:id", async (req,res)=>
{
    const token= req.params.id
    const data=jwt.verify(token,"123456")
    const user=await User.findOne({_id:data._id, "tokens.token":token})
     if(user)
     {
       user.confirmed= true;
       user.save()
       res.redirect("/login")
     }
     else 
     {
       res.send({"error " : "Invalid Requests "})
     }

})


router.post("/login",async (req,res)=>
{

  try{
  const user=await User.findByCredentials(req.body.email,req.body.password);
    if(user.confirmed===false)
      {
        req.flash("error", "That email has already been registered.");

        return res.redirect("/login")
         
      }
      else {
        const token=await user.generateToken();
        res.cookie('auth-token',token)
         res.redirect('/profile')
      }
  }
  catch(e)
  {
    res.send(e)
  }

})

router.post("/signup",async (req,res)=>
{
    const user= new User(req.body)
    const token=await user.generateToken();
    const url =  "http://localhost:3000/confirm/" +  token 
    Emails.sendWelcomeEmail(user.email, url )
       res.cookie('auth-key',token)  
       res.render("welcome")
})

module.exports= router