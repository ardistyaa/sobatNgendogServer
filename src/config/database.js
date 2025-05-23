import mysql from 'mysql2/promise';
import config from './env.js';

const dbPool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  port: config.db.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

dbPool.getConnection()
.then((connection) => {
console.log("✅ Database connected successfully!");
connection.release(); 
})
.catch((err) => {
console.error("❌ Database connection failed:", err.message);
});

export default dbPool;
