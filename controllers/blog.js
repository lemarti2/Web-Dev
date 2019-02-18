/* GET list page */
module.exports.list = function(reg, res){
  res.render('list', {title: "Blog List"});
};
/* GET add page */
module.exports.add = function(req, res){
  res.render('add', {tittle: "Add Blogs"});
};

