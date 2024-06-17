const {Router} = require('express')
const User = require('../models/user')

const router = Router()

router.get('/signin' , (req, res) => {
    return res.render('signin')
})

router.get('/signup' , (req , res) => {
    return res.render('signup')     
})

router.post('/signup' , async(req , res) => {
    const { fullName , email , password } = req.body
    await User.create({
        fullName ,  
        email , 
        password
    })
    return res.redirect('/')
})

router.post('/signin' , async(req , res) => {
    const {email , password} = req.body
    try{
        const token = await User.matchPasswordAndGenerateTokens(email , password)
        console.log("Token is here : " ,token);
        return res.cookie("token" , token ).redirect('/')
    }
    catch(err){
        return res.render('signin' , {
            error : "Incorrect Email Or Password"
        })
    }
})

router.get('/logout' , (req , res) =>{
    return res.clearCookie('token').redirect('/')
})

module.exports = router;