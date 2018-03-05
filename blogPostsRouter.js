'use strict';

const express = require('express')
const router = express.Router();
const uuid = require('uuid');

const {BlogPosts} = require('./models');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const now = new Date().toISOString();

BlogPosts.create('David Walsh Blog', 'JavaScript, personal thoughts, and guids', 'David Walsh', now);
BlogPosts.create('DAILYJS', 'JavaScript and node', 'Alex R. Young', now);
BlogPosts.create('SITEPOINT', 'Web development portals', 'James Hibbard', now);

//Read (get) blogpost
router.get('/',(req, res) => {
	res.json(BlogPosts.get());
});

//Create (post) blogpost
router.post('/', jsonParser, (req, res) => {
	const blogPostsFields = ['title', 'content', 'author', 'publishDate'];
	for (let i = 0; i < blogPostsFields.length; i++) {
		let field = blogPostsFields[i];
		if(!(field in req.body)) {
			const errorMessage = `${field} is not in request body`;
			console.log(errorMessage);
			return res.status(400).send(errorMessage);
		}
	}
	const newBlogPost = BlogPosts.create(req.body.title, req.body.content,
											req.body.author, req.body.publishDate);
	res.status(201).json(newBlogPost);
});

//Update (put) blogpost
router.put('/:id', jsonParser, (req, res) => {
	const blogPostsFields = ['id', 'title', 'content', 'author', 'publishDate'];

	for(let i = 0; i < blogPostsFields.length; i++) {
		const field = blogPostsFields[i];
		if(!(field in req.body)) {
			const errorMessage = `${field} is not in request body`;
			console.log(errorMessage);
			return res.status(400).send(errorMessage);
		};
	};

	if(req.params.id !== req.body.id) {
		const errorMessage = `${req.params.id} is not in blog post`;
		console.log(errorMessage);
		return res.status(400).send(errorMessage);
	}

	const updatedBlogPost = BlogPosts.update({
						id: req.params.id,
						title: req.body.title,
						content: req.body.content,
						author: req.body.author,
						publishDate: req.body.publishDate 
					});
	res.status(201).end();

});

//Delete blog post
router.delete('/:id', (req, res) => {
		BlogPosts.delete(req.params.id);
		console.log(`Deleted blog post \`${req.params.id}\``);
		res.status(201).end();
});

module.exports = router;
