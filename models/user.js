const { createHmac , randomBytes } = require('crypto');
const {Schema , model}= require('mongoose')

const mongoose = require('mongoose');
const { createTokensForUser } = require('../services/authentication');

mongoose.connect('mongodb://127.0.0.1:27017/blogify')
.then(()=>{
    console.log("Mongodb Connected");
})
.catch((err)=> {
    console.log("Mongodb error" , err);
})

const userSchema = new Schema({
    fullName : {
        type : String ,     
        required : true
    } , 
    email : {
        type : String , 
        required : true , 
        unique : true
    } ,
    salt : {
        type : String , 
    } ,
    password : {
        type : String , 
        required : true
    } , 
    profileImageUrl : {
        type : String, 
        default : '/public/images/user.png'
    } , 
    role : {
        type : String , 
        enum : ['USER' , "ADMIN"] ,
        default : "USER" 
    }
})

userSchema.pre("save" , function(next){
    const user = this;
    if(!user.isModified('password')) return;

    const salt = randomBytes(16).toString();
    const hashPassword = createHmac('sha256' , salt)
    .update(user.password)
    .digest('hex')    

    this.salt = salt;
    this.password = hashPassword;

    next()
})

userSchema.static('matchPasswordAndGenerateTokens' , async function(email , password){
    const user = await this.findOne({ email })
    if(!user) throw new Error('User Not Found!')

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvideHash = createHmac('sha256' , salt)
    .update(password)
    .digest('hex')    

    if(hashedPassword !== userProvideHash) throw new Error('Incorrect Password!')

    const token = createTokensForUser(user)
    return token;
})
const User = model('user' , userSchema)

module.exports = User;