const express = require('express');
const router = express.Router();
const nanoid = require('nanoid');
const multer = require('multer');
const path = require('path');
const config = require('../config');
const mysql = require('mysql');

const connection = mysql.createConnection(config.sqlConfig);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, config.uploadPath)
	},
	filename: (req, file, cb) => {
		cb(null, nanoid() + path.extname(file.originalname))
	}
});

const upload = multer({storage});

const createRouter = () => {

	connection.connect(function(err) {
		if (err) res.status(500).send({error: err});

		router.get('/', (req, res) => {
			const query = `select id, title, image, date from news;`;

			connection.query(query, function (err, result) {
				if (err) res.status(400).send({error: err});
				res.send(result);
			});
		});

		router.post('/', upload.single('image'), (req, res) => {
			console.log(req.body);

			if (!req.body.title || !req.body.article) {
				res.status(400).send({error: 'Title and the article text are required'});
			} else {
				if (req.file) {
					req.body.image = req.file.filename;
				}


				const query = `insert into news(title, article, image, date) 
                values (
                '${req.body.title}', 
                '${req.body.article}', 
                '${req.body.image || ""}',
                '${req.body.date}'
                );`;

				console.log(query);


				connection.query(query, function (err, result) {
					if (err) {res.status(400).send({error: err});}
					else {
						req.body.id = result.insertId;
						res.send(req.body);
					}
				});
			}
		});

		router.get('/:id', (req, res) => {

			const id = req.params.id;

			const query = `select * from news where id = ${id};`;

			connection.query(query, function (err, result) {
				if (err) res.status(400).send({error: err});
				res.send(result);
			});
		});



		router.delete('/:id', (req, res) => {

			const id = req.params.id;

			const query = `delete from news where id = ${id};`;

			connection.query(query, function (err, result) {
				if (err) res.status(400).send({error: err});
				res.send(result);
			});
		});


	});

	return router;
};

module.exports = createRouter;
