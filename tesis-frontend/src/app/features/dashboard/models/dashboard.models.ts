export interface DashboardAlert {
  creditId: string;
  customerId: string;
  customerName: string;
  amount: string;
  dueDate: string;
  daysOverdue: number;
  status: string;
}

export interface DashboardStats {
  semaphore: { green: number; yellow: number; red: number };
  cashChart: Array<{ date: string; income: number; expense: number }>;
}
