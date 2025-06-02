export interface Expense {
    id?: number;
    amount: number;
    description: string;
    category: string;
    date: string;
    createdAt?: string;
}

export interface ExpenseStats {
    category: string;
    count: number;
    total: number;
}