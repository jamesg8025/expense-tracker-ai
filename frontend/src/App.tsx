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

import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import { Expense } from './types';

function App() {

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    // For now, just add to local state with a temp ID
    const expenseWithId = {
      ...newExpense,
      id: Date.now(), // temp ID
      category: 'Uncategorized' // temp category
    };

    setExpenses(prev => [expenseWithId, ...prev]); // Add new expense to the beginning of the list
    console.log('Added expense:', expenseWithId);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Expense Tracker
        </h1>
        <ExpenseForm onAddExpense={handleAddExpense} />

        {/* Temp display of expenses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
          {expenses.length === 0 ? (
            <p className="text-gray-500">No expenses yet. Add one above!</p>
          ) : (
            <ul className="space-y-2">
              {expenses.map((expense) => (
                <li key={expense.id} className='flex justify-between items-center py-2 border-b'>
                  <div>
                    <span className="font-medium">{expense.description}</span>
                    <span className="text-sm text-gray-500 ml-2">({expense.date})</span>
                  </div>
                  <span className="font-semibold text-green-600">${expense.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;