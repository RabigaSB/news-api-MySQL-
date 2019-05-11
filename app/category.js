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

			const query = `select * from category;`;

			connection.query(query, function (err, result) {
				if (err) res.status(400).send({error: err});
				res.send(result);
			});
		});

		router.get('/:id', (req, res) => {

			const id = req.params.id;

			const query = `select * from category where id = ${id};`;

			connection.query(query, function (err, result) {
				if (err) res.status(400).send({error: err});
				res.send(result);
			});
		});

		router.post('/', upload.single(), (req, res) => {
			if (!req.body.category_name) {
				res.status(400).send({error: 'category name is required'});
			} else {
				const query = `insert into category(category_name, category_description) 
                values (
                '${req.body.category_name}', 
                '${req.body.category_description || ""}'
                );`;

				connection.query(query, function (err, result) {
					if (err) res.status(400).send({error: err});
					req.body.id = result.insertId;
					console.log(result);
					res.send(req.body);
				});
			}
		});

		router.delete('/:id', (req, res) => {

			const id = req.params.id;

			const query = `delete from category where id = ${id};`;

			connection.query(query, function (err, result) {
				if (err) res.status(400).send({error: err});
				res.send(result);
			});
		});

		router.put('/:id', upload.single(), (req, res) => {
			if (!req.body.category_name)
				res.status(400).send({error: 'category name is required'});

			const id = req.params.id;

			const query = `update category set
			category_name = '${req.body.category_name}',
			category_description = '${req.body.category_description || ""}'
			where id = ${id}
			`;

			connection.query(query, function (err, result) {
				if (err) {res.send({error: err});}
				else {
					if (result.affectedRows) {
						req.body.id = id;
						res.send(req.body);
					} else {
						res.send({error: "No such Id"});
					}
				}

			});
		});
	});

	return router;
};

module.exports = createRouter;
