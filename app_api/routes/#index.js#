var express = require('express'); 
var router = express.Router(); 
var ctrlBlogs = require('../controllers/blogs'); 
//blogs 
router.get('/blogs', ctrlBlogs.blogList); 
router.post('/blogs', ctrlBlogs.blogCreate); 
router.get('/blogs/:blogid', ctrlBlogs.blogReadOne); 
router.put('/blogs/:blogid', ctrlBlogs.blogUpdateOne); 
router.delete('/blogs/:blogid', ctrlBlogs.blogDeleteOne);
module.exports = router;
