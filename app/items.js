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
			const query = `select * from items;`;

			connection.query(query, function (err, result) {
				if (err) res.status(400).send({error: err});
				res.send(result);
			});
		});

		router.get('/:id', (req, res) => {
			console.log(req.params);

			const id = req.params.id;

				const query = `select * from items where id = ${id};`;

				connection.query(query, function (err, result) {
					if (err) res.status(400).send({error: err});
					res.send(result);
				});
		});

		router.post('/', upload.single('photo'), (req, res) => {

			if (!req.body.item_name || !req.body.category_id || !req.body.location_id) {
				res.status(400).send({error: 'item name, category id and location id are required'});
			} else {
				if (req.file) {
					req.body.photo = req.file.filename;
				}

				const query = `insert into items(item_name, category_id, location_id, item_description, photo) 
                values (
                '${req.body.item_name}', 
                '${req.body.category_id}', 
                '${req.body.location_id}', 
                '${req.body.item_description || ""}',
                '${req.body.photo || ""}'
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

				const query = `delete from items where id = ${id};`;

				connection.query(query, function (err, result) {
					if (err) res.status(400).send({error: err});
					res.send(result);
				});
		});

		router.put('/:id', upload.single(), (req, res) => {
			if (!req.body.item_name || !req.body.category_id || !req.body.location_id) {
				res.status(400).send({error: 'item name, category id and location id are required'});
			} else {
				if (req.file) {
					req.body.photo = req.file.filename;
				}

				const id = req.params.id;

				const query = `update items set
				item_name = '${req.body.item_name}',
				category_id = '${req.body.category_id}',
				location_id = '${req.body.location_id}',
				item_description = '${req.body.item_description || ""}',
				photo = '${req.body.photo || ""}'
				where id = ${id}
				`;

				connection.query(query, function (err, result) {
					if (err) res.status(400).send({error: err});
					else {
						if (result.affectedRows) {
							req.body.id = id;
							res.send(req.body);
						} else {
							res.send({error: "No such Id"});
						}
					}
				});
			}
		});
	});

	return router;
};

module.exports = createRouter;
