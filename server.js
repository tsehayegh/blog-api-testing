const express = require('express');

const blogPosts = require('./blogPostsRouter');

const morgan = require('morgan')

const app = express();

app.use(morgan('common'));

app.use('/blogPosts', blogPosts);

let server;
function runServer() {
	const port = process.env.PORT || 8080;
	const new Promise((resolve, reject) =>{
	server = app.listen(port, () => {
			console.log('Your app is listening on port ${port}');
			resolve(server);
		}).on('error', (err) => {
				reject(err);
			});
		}
	});
}

function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('Closing server');
		server.close( (err) => {
			if (err) {
				reject(err);
				return;
			}
		});
	})
}

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send(err.stack);
});


