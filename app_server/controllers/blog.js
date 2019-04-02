module.exports.list = function(req, res) {
     res.render('list', {
          title: "Blog List",
          blogs: [{
               blogtitle: 'one blog',
               blogtext: 'two text',
               createdon: Date.now
          }, {
               blogtitle: 'red blog',
               blogtext: 'blue text',
               createdon: Date.now
          }, {
               blogtitle: 'dr blog',
               blogtext: 'seuss text',
               createdon: Date.now
          }]
     });
};
module.exports.add = function (req, res) {
     res.render('add', { title: "Add Blogs"});
};
module.exports.edit = function (req, res) {
     res.render('edit', { title: "Edit Blog"});
};
module.exports.remove = function (req, res) {
     res.render('remove', { title: "Remove Blog"});
};
