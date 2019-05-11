const path = require('path');
const rootPath = __dirname;


module.exports = {
	rootPath,
	uploadPath: path.join(rootPath, 'public/uploads'),
	sqlConfig: {
		host: "localhost",
		user: "root",
		database: "news_site",
		password: "password10",
		multipleStatements: true
	}
};
