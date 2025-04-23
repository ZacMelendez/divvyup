export interface User {
    _id: string;
    name: string;
    email: string;
    image?: string;
}

export interface Group {
    _id: string;
    name: string;
    description?: string;
    members: User[];
    expenses: Expense[];
    createdBy: string;
}

export interface Expense {
    _id: string;
    description: string;
    amount: number;
    date: string;
    paidBy: {
        _id: string;
        name: string;
    };
    group: string;
    splitType: "equal" | "percentage" | "amount";
    splits: ExpenseSplit[];
}

export interface ExpenseSplit {
    user: {
        _id: string;
        name: string;
    };
    amount: number;
    percentage?: number;
    isPaid: boolean;
}
