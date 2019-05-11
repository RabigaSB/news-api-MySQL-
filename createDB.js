const mysql = require('mysql');

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password10",
	multipleStatements: true
});

const query =
	`
	CREATE DATABASE news_site;
	
	use news_site;
	
	CREATE TABLE news 
	(
	id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    article TEXT NOT NULL,
    image VARCHAR(50),
    \`date\` DATE
    );
	
	CREATE TABLE comments 
	(
	id INT PRIMARY KEY AUTO_INCREMENT,
	news_id INT NOT NULL,
    FOREIGN KEY FK_comments(news_id) REFERENCES news(id),
    author VARCHAR(100),
    comment VARCHAR(200) NOT NULL
    );
	
`;

connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
	connection.query(query, function (err, result) {
		if (err) throw err;
		console.log("Result: " , result);
	});
});

// this piece of code is to reset password
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password10'
