const express = require('express')
const multer = require('multer')
const router = express.Router()
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        const fieldname = `${Date.now()} -` + file.originalname
        return cb(null, fieldname)
    }
}
)
const upload = multer({ storage })

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user
    });
})
router.post('/', upload.single('CoverImage'), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    return res.redirect('/');
})
module.exports = router 