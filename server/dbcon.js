var mysql = require('mysql');

const pool = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'artists',
  multipleStatements: true,
});
pool.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});
module.exports.pool = pool;

// Init mysql
// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: 'classmysql.engr.oregonstate.edu',
//   user: 'INSERT_USER_NAME',
//   password: 'INSERT_PASSWORD',
//   database: 'cs340_USERNAME',
//   multipleStatements: true,
// });

// module.exports.pool = pool;
