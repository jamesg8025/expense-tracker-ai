// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import { expenseAPI } from './services/api';
import { Expense } from './types';

function App() {

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load expenses from backend when component mounts
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedExpenses = await expenseAPI.getExpenses();
      setExpenses(fetchedExpenses);
    } catch (err) {
      console.error('Error loading expenses:', err);
      setError('Failed to load expenses. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (newExpense: Omit<Expense, 'id'>) => {
    try {
      setError(null);
      console.log('Adding expense:', newExpense);
      
      // Add to backend
      const addedExpense = await expenseAPI.addExpense(newExpense);
      console.log('Expense added successfully:', addedExpense);
      
      // Update local state
      setExpenses(prev => [addedExpense, ...prev]);
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to add expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      setError(null);
      await expenseAPI.deleteExpense(id);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('Failed to delete expense. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Expense Tracker
        </h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={loadExpenses}
              className="mt-2 text-red-700 underline hover:text-red-900"
            >
              Try Again
            </button>
          </div>
        )}
        
        <ExpenseForm onAddExpense={handleAddExpense} />
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Expenses</h2>
            <button 
              onClick={loadExpenses}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Refresh
            </button>
          </div>
          
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No expenses yet. Add one above to get started! 🎯
            </p>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">{expense.description}</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {expense.category}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{expense.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-green-600 text-lg">
                      ${parseFloat(expense.amount.toString()).toFixed(2)}
                    </span>
                    <button
                      onClick={() => expense.id && handleDeleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;