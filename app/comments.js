const express = require('express');
const router = express.Router();
const multer = require('multer');
const config = require('../config');
const mysql = require('mysql');


const connection = mysql.createConnection(config.sqlConfig);

const upload = multer();

const createRouter = () => {

	connection.connect(function(err) {
		if (err) res.status(500).send({error: err});

		router.get('/', (req, res) => {
			let query = `select * from comments;`;
			if(req.query.news_id) {
				query = `select * from comments where news_id = ${req.query.news_id};`
			}

			connection.query( query + ';', function (err, result) {
				if (err) res.status(400).send({error: err});
				res.send(result);
			});
		});

		router.post('/', upload.single(), (req, res) => {
			if (!req.body.news_id || !req.body.comment) {
				res.status(400).send({error: 'news id and comment text are required'});
			} else {
				const query = `insert into comments(news_id, author, comment) 
                values (
                '${req.body.news_id}', 
                '${req.body.author || "Anonymous"}',
                '${req.body.comment}'
                );`;

				connection.query(query, function (err, result) {
					if (err) {res.status(400).send({error: err});}
					else {
						req.body.id = result.insertId;
						req.body.author = req.body.author || "Anonymous";
						res.send(req.body);
					}
				});
			}
		});
	});

	return router;
};

module.exports = createRouter;
