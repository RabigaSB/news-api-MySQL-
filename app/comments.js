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

			const query = `select * from comments;`;

			connection.query(query, function (err, result) {
				if (err) res.status(400).send({error: err});
				res.send(result);
			});
		});
	});

	return router;
};

module.exports = createRouter;
