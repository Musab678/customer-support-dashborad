import Papa from 'papaparse';
import { TicketData, KPIData, TeamData, StatusData } from '@/types/dashboard';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1JxttvYcfKqqWGEFQTo9rw6UGSecWQK-j_WB923WR9pc/export?format=csv';

export class DataService {
  private static cache: {
    data: TicketData[] | null;
    timestamp: number;
  } = {
    data: null,
    timestamp: 0
  };

  private static readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  static async fetchTicketData(): Promise<TicketData[]> {
    const now = Date.now();
    
    // Return cached data if it's still valid
    if (this.cache.data && (now - this.cache.timestamp) < this.CACHE_DURATION) {
      return this.cache.data;
    }

    try {
      const response = await fetch(CSV_URL);
      const csvText = await response.text();
      
      const parsed = Papa.parse<TicketData>(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim()
      });

      if (parsed.errors.length > 0) {
        console.warn('CSV parsing errors:', parsed.errors);
      }

      // Cache the data
      this.cache.data = parsed.data;
      this.cache.timestamp = now;

      return parsed.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      // Return cached data if available, even if stale
      return this.cache.data || [];
    }
  }

  static calculateKPIs(data: TicketData[]): KPIData {
    const totalTickets = data.length;
    const completedTickets = data.filter(ticket => 
      ticket.Status?.toLowerCase() === 'resolved'
    ).length;
    const pendingTickets = data.filter(ticket => 
      ticket.Status?.toLowerCase() !== 'resolved'
    ).length;

    // Calculate average resolution time for resolved tickets
    const resolvedTickets = data.filter(ticket => 
      ticket.Status?.toLowerCase() === 'resolved' && 
      ticket["Date Resolved"] && 
      ticket["Date Created"]
    );

    let avgResolutionTime = 0;
    if (resolvedTickets.length > 0) {
      const totalResolutionTime = resolvedTickets.reduce((total, ticket) => {
        const created = new Date(ticket["Date Created"]);
        const resolved = new Date(ticket["Date Resolved"]);
        return total + (resolved.getTime() - created.getTime());
      }, 0);
      avgResolutionTime = totalResolutionTime / resolvedTickets.length / (1000 * 60 * 60 * 24); // Convert to days
    }

    return {
      totalTickets,
      pendingTickets,
      completedTickets,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10 // Round to 1 decimal place
    };
  }

  static getTeamData(data: TicketData[]): TeamData[] {
    const teamCounts = data.reduce((acc, ticket) => {
      const team = ticket["Assigned Team"] || 'Unassigned';
      acc[team] = (acc[team] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(teamCounts).map(([team, count]) => ({
      team,
      count
    }));
  }

  static getStatusData(data: TicketData[]): StatusData[] {
    const statusCounts = data.reduce((acc, ticket) => {
      const status = ticket.Status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }));
  }

  static getTimeSeriesData(data: TicketData[]) {
    const dailyCounts = data.reduce((acc, ticket) => {
      const date = new Date(ticket["Date Created"]).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailyCounts)
      .map(([date, count]) => ({
        date,
        tickets: count,
        cumulative: 0 // Will be calculated
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item, index, array) => ({
        ...item,
        cumulative: array.slice(0, index + 1).reduce((sum, curr) => sum + curr.tickets, 0)
      }));
  }

  static clearCache(): void {
    this.cache = { data: null, timestamp: 0 };
  }
}