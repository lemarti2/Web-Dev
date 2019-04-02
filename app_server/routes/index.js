var express = require('express');
var router = express.Router();
var bloghome = require('../controllers/home');
var bloglist = require('../controllers/blog.js');
var blogedit = require('../controllers/blog.js');
var blogremove = require('../controllers/blog.js');

router.get('/', bloghome.home);
router.get('/list', bloglist.list);
router.get('/add', bloglist.add);
router.get('/edit/:blogid', blogedit.edit);
router.post('/edit/:blogid', blogedit.editBlog);
router.get('/remove/:blogid', blogremove.remove);
router.post('/add', bloglist.addBlog);
router.post('/remove/:blgid', blogremove.removeBlog);
module.exports = router;
