export interface Expense {
  currency: string;
  createdAt: number;
  sourceContent: string;
  date: string;
  sourceType: string;
  userId: string;
  notes: string;
  category: string;
  amount: number;
  paymentMethod: string;
  processingStatus: string;
  description: string;
  tags: string[];
  expenseId: string;
}
