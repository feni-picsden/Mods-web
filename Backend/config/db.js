import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config();

const db = mysql.createPool({
  connectTimeout: 2000000,
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,  
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
})

db.getConnection((err, connection) => {
  if (err) {
      console.error("Database connection error:", err);
      throw err;
  }
  console.log("✅ MySQL Connected Successfully");
  connection.release(); 
});

// module.exports = pool.promise();
export default db;