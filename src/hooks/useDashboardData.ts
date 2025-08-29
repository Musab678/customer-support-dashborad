import { useState, useEffect, useCallback } from 'react';
import { DataService } from '@/services/dataService';
import { TicketData, KPIData, TeamData, StatusData } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';

export function useDashboardData() {
  const [data, setData] = useState<TicketData[]>([]);
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [teamData, setTeamData] = useState<TeamData[]>([]);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<Array<{ 
    date: string; 
    tickets: number; 
    cumulative: number 
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const { toast } = useToast();

  const loadData = useCallback(async (showToast = false) => {
    setIsLoading(true);
    try {
      const ticketData = await DataService.fetchTicketData();
      
      if (ticketData.length === 0) {
        toast({
          title: "No data available",
          description: "Unable to fetch ticket data. Please try again later.",
          variant: "destructive"
        });
        return;
      }

      setData(ticketData);
      setKpis(DataService.calculateKPIs(ticketData));
      setTeamData(DataService.getTeamData(ticketData));
      setStatusData(DataService.getStatusData(ticketData));
      setTimeSeriesData(DataService.getTimeSeriesData(ticketData));
      setLastUpdated(new Date());

      if (showToast) {
        toast({
          title: "Data refreshed",
          description: `Updated with ${ticketData.length} tickets`,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to fetch the latest data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh every hour
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(true);
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [loadData]);

  const refresh = useCallback(() => {
    DataService.clearCache();
    loadData(true);
  }, [loadData]);

  return {
    data,
    kpis,
    teamData,
    statusData,
    timeSeriesData,
    isLoading,
    lastUpdated,
    refresh
  };
}