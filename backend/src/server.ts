import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './models/database';
import expenseRoutes from './routes/expenses';
import { timeStamp } from 'console';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http:localhost:3000', // React app URL
    credentials: true // Allow credentials
}));
app.use(express.json());

// Routes
app.use('/api/expenses', expenseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'Server is running!',
        timeStamp: new Date().toISOString(),
        database: 'Connected'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Expense Tracker API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            expenses: '/api/expenses',
            stats: '/api/expenses/stats'
        }
    });
});

// Start server
const startSever = async () => {
    try {
        console.log('Initializing database...');
        await initDatabase();
        console.log('Database initialized successfully');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startSever();