import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create new PostgreSQL connection pool
export const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhot',
    database: process.env.DB_NAME || 'expense_tracker',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
});

// Initialize databse tables
export const initDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS expenses (
            id SERIAL PRIMARY KEY,
            amount DECIMAL(10,2) NOT NULL,
            description TEXT NOT NULL,
            category VARCHAR(100),
            data DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('Database initialized succenssfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

export interface Expense {
    id?: number;
    amount: number;
    description: string;
    category?: string;
    date: string;
    created_at?: string;
}