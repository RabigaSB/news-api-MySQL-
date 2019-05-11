const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../config');
const multer = require('multer');



const connection = mysql.createConnection(config.sqlConfig);

const upload = multer();

const createRouter = () => {


	connection.connect(function(err) {
		if (err) res.status(500).send({error: err});

		router.get('/', (req, res) => {

				const query = `select * from location;`;

				connection.query(query, function (err, result) {
					if (err) res.status(400).send({error: err});
					res.send(result);
				});
		});

		router.get('/:id', (req, res) => {

			const id = req.params.id;

				const query = `select * from location where id = ${id};`;

				connection.query(query, function (err, result) {
					if (err) res.status(400).send({error: err});
					res.send(result);
				});
		});

		router.post('/', upload.single(), (req, res) => {
			if (!req.body.location_name) {
				res.status(400).send({error: 'location name is required'});
			} else {
				const query = `insert into location(location_name, location_description) 
                values (
                '${req.body.location_name}', 
                '${req.body.location_description || ""}'
                );`;

				connection.query(query, function (err, result) {
					if (err) res.status(400).send({error: err});
					req.body.id = result.insertId;
					res.send(req.body);
				});
			}
		});

		router.delete('/:id', (req, res) => {

			const id = req.params.id;

			const query = `delete from location where id = ${id};`;

			connection.query(query, function (err, result) {
				if (err) res.status(400).send({error: err});
				res.send(result);
			});
		});

		router.put('/:id', upload.single(), (req, res) => {
			if (!req.body.location_name)
				res.status(400).send({error: 'location name is required'});


			const id = req.params.id;

			const query = `update location set
			location_name = '${req.body.location_name}',
			location_description = '${req.body.location_description || ""}'
			where id = ${id}
			`;

			connection.query(query, function (err, result) {
				if (err) {res.status(400).send({error: err});}
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
