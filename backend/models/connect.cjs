var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'mysql-nttoan.h.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_ZWiBnrk9nUxlHlKfC8S',
  database: 'defaultdb',
  port: 25674
});
connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;