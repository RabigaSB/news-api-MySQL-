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
	});

	return router;
};

module.exports = createRouter;
