// Imports
export interface EmiAttributes {
  emi_id?: number;
  loan_id: number;
  user_id: number;
  emi_amount: number;
  capital_amount: number;
  interest_amount: number;
  due_date: Date;
  status: 'Pending' | 'Paid' | 'Overdue';
  payment_date?: Date;
  late_fee?: number;
}
