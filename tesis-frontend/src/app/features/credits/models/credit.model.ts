export interface CreditSummary {
  id: string;
  dueDate: string;
  amount: string;
  status: string;
}

export interface CreditDetail {
  id: string;
  customerId: string;
  amount: string;
  dueDate: string;
  status: string;
  createdAt: string;
}
