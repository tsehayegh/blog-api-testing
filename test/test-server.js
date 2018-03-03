
const chai = require('chai');

const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);



describe('Blog Post', function(){
	before(function(){
		return runServer();
	});

	after(function(){
		return closeServer();
	});

  // GET - List all blog posts
  it('should return all colors', function() {
    return chai.request(app)
      .get('/blogPosts')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(1);
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

  //POST - add new blog post to the API
  it('should add blog posts', function(){
  	const newBlogPost = {title: 'JavaScript', 
  			content:'Introduction to JavaScript',
  			'author': 'Tom', publishDate: 'Mar-4-2-18'};
  	 return chai.request(app)
	    .post('/blogPosts')
	    .send(newBlogPost)
	    .then(function(res) {
	      expect(res).to.have.status(201);
	      expect(res).to.be.json;
	      expect(res.body).to.be.a('object');
	      expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
	      expect(res.body.id).to.not.equal(null);
	      expect(res.body).to.deep.equal(Object.assign(newBlogPost, {id: res.body.id}));
    });
  });

  //PUT - update blog post
  it('should update blog post', function(){
    const updateData = {
      title: 'nodejs',
      content: 'Introduction',
      author: 'Melu',
      publishDate: 'Mar-5-2018'
    };
    return chai.request(app)
      .get('/blogPosts')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/blogPosts/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        expect(res).to.have.status(201);
      });
  });
 
 //DELETE blog post from API
 it('should delete items on DELETE', function() {
    return chai.request(app)
      .get('/blogPosts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blogPosts/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(201);
      });
  });
})