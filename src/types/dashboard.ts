export interface TicketData {
  "Ticket ID": string;
  "Date Created": string;
  "Customer Email": string;
  "Category (Auto)": string;
  "Assigned Team": string;
  "Priority": string;
  "Status": string;
  "Date Resolved": string;
}

export interface KPIData {
  totalTickets: number;
  pendingTickets: number;
  completedTickets: number;
  avgResolutionTime: number;
}

export interface TeamData {
  team: string;
  count: number;
}

export interface StatusData {
  status: string;
  count: number;
}