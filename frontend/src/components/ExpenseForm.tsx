import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Expense } from '../types';

interface ExpenseFormProps {
    onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !description || !date) {
            alert('Please fill in all fields');
            return;
        }

        onAddExpense({
            amount: parseFloat(amount),
            description,
            date,
            category: '' // Will be set by AI on backend
        });

        // Reset form
        setAmount('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Expense</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Amount ($)
                        </label>
                        <input 
                            type="number"
                            id="amount"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder='Coffee at Starbucks'
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className='block text-sm font-medium text-gray-700 mb-1'>
                            Date
                        </label>
                        <input 
                        type="date"
                        id='date'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                        />
                    </div>
                </div>

                <button 
                type='submit'
                className='w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-2 rounded-md transition duration-200 flex items-center justify-center gap-2'
                >
                    <Plus size={20} />
                    Add Expense
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;