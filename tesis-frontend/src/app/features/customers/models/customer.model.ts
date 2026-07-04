
export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  docType: string;
  docNumber: string;
  email?: string;
  semaphore?: {
    status: SemaphoreStatus;
    reason: string;
    daysToDue?: number;
  };
}
export type SemaphoreStatus='GREEN'|'YELLOW'|'RED';