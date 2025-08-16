import axios from 'axios';
import { Expense, ExpenseStats } from '../types';

const API_BASE_URL = 'htpps://localhost:5001/api';

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

const api = axios.create({
    baseURL: 'http://localhost:5001/api',

});

export const expenseAPI = {
    // Get all expenses
    getExpenses: async (): Promise<Expense[]> => {
        const response = await api.get('/expenses');
        return response.data;
    },

    // Add new expense
    addExpense: async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
        const response = await api.post('/expenses', expense);
        return response.data;
    },

    // Update expense
    updateExpense: async (id: number, expense: Partial<Expense>): Promise<Expense> => {
        const response = await api.put(`/expenses/${id}`, expense);
        return response.data;
    },

    // Delete expense
    deleteExpense: async (id: number): Promise<void> => {
        await api.delete(`/expenses/${id}`);
    },

    // Get expense statistics
    getStats: async (): Promise<ExpenseStats[]> => {
        const response = await api.get('/expenses/stats');
        return response.data;
    },
};

export default expenseAPI;