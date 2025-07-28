import express, { Request, Response } from 'express';
import { pool, Expense } from '../models/database';
import { categorizeExpense } from '../services/aiService';

const router = express.Router();

// Get all expenses
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC, created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Add new expense
router.post('/', async (req: Request, res: Response) => {
  try {
    const { amount, description, date } = req.body;
    
    // Validate input
    if (!amount || !description || !date) {
      return res.status(400).json({ error: 'Amount, description, and date are required' });
    }

    console.log('Adding expense:', { amount, description, date });

    // Get AI categorization
    const category = await categorizeExpense(description);
    
    const result = await pool.query(
      'INSERT INTO expenses (amount, description, category, date) VALUES ($1, $2, $3, $4) RETURNING *',
      [amount, description, category, date]
    );
    
    console.log('Expense added successfully:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Update expense
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, description, category, date } = req.body;
    
    const result = await pool.query(
      'UPDATE expenses SET amount = $1, description = $2, category = $3, date = $4 WHERE id = $5 RETURNING *',
      [amount, description, category, date, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete expense
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Get expense statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        category,
        COUNT(*) as count,
        SUM(amount) as total
      FROM expenses 
      GROUP BY category
      ORDER BY total DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;