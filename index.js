const express = require('express')
const app = express();
const port = 3000;
const path = require('path')
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const Blog = require('./models/blog')

app.set('view engine' , 'ejs')
app.set('views' , path.resolve('./views'))
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.resolve('./public')))
app.use('/user' , userRoute);
app.use('/blog' , blogRoute);

app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))
app.get('/' , async(req ,res) => {
    const allBlogs = await Blog.find({})
    res.render('home' , {
        user : req.user,
        blogs : allBlogs
    })
})
app.listen(port , ()=> {
    console.log(`Server start on http://localhost:${port}`)
})