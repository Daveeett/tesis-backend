export interface CashSession {
  id: string;
  status: 'OPEN' | 'CLOSED';
  openedAt: string;
  closedAt: string | null;
  openedBy: string;
  closedBy: string | null;
  openingBalance: string;
  closingBalance: string | null;
  expectedBalance: string | null;
  difference: string | null;
  totalIncomes: string;
  totalExpenses: string;
  movementCount: number;
  movements: CashMovement[];
}

export interface CashMovement {
  id: string;
  movementType: 'INCOME' | 'EXPENSE';
  amount: string;
  concept: string;
  createdAt: string;
}

export interface CashHistoryEntry {
  id: string;
  status: string;
  openedAt: string;
  closedAt: string | null;
  openedBy: string;
  closedBy: string | null;
  openingBalance: string;
  closingBalance: string | null;
  expectedBalance: string | null;
  difference: string | null;
  totalIncomes: string;
  totalExpenses: string;
  movementCount: number;
}
