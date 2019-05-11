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
			const query = `select * from news;`;

			connection.query(query, function (err, result) {
				if (err) res.status(400).send({error: err});
				res.send(result);
			});
		});


	});

	return router;
};

module.exports = createRouter;
