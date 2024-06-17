const express = require('express')
const multer = require('multer')
const router = express.Router()
const path = require('path')
const Blog = require('../models/blog')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
        const fieldname = `${Date.now()}-`+file.originalname
        return cb(null, fieldname)
    }
})
const upload = multer({ storage })

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user
    });
})
router.get('/:id' , async(req , res) => {
    const blog = await Blog.findById(req.params.id)
    return res.render('blog' , {
        user : req.user , 
        blog  
    })
})
router.post('/', upload.single('CoverImage'), async(req, res) => {
    const { body, title } = req.body
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.body._id,
        coverImageUrl: `/uploads/${req.file.filename}`,
    })
    return res.redirect(`/blog/${blog._id}`);
})
module.exports = router 