import mysql from 'mysql2/promise';
// 建立 MySQL 連線池
const pool = mysql.createPool({
    host: process.env.DBHOST || 'localhost',
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: 'mattlocaldb',
});

export async function getAllAdmins() {
    try {
        const [rows] = await pool.query('SELECT * FROM admin');
        return rows;
    } catch (err) {
        throw new Error(`Database error: ${(err as Error).message}`);
    }
}

export async function findAdminByAccountAndPassword(account: string, password: string) {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM admin WHERE account = ? AND password = ?',
            [account, password]
        );
        return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
    } catch (err) {
        throw new Error(`Database error: ${(err as Error).message}`);
    }
}