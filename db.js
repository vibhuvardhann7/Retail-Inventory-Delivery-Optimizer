const mysql = require('mysql');

const db = mysql.createConnection({
  host: '127.0.0.1',         // or 'localhost'
  user: 'root',
  password: 'Vibhu@123',     // change if yours is different
  database: 'supply_chain',  // this must match your DB
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('❌ DB connection error:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
});

module.exports = db;



