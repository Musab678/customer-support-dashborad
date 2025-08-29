import { 
  TicketCheck, 
  Clock, 
  CheckCircle, 
  Users,
  AlertCircle 
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { TicketsChart } from '@/components/dashboard/TicketsChart';
import { TicketsTable } from '@/components/dashboard/TicketsTable';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { 
    data, 
    kpis, 
    teamData, 
    statusData, 
    timeSeriesData, 
    isLoading, 
    lastUpdated, 
    refresh 
  } = useDashboardData();
  
  const { toast } = useToast();

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Support Dashboard',
        text: 'Check out this support ticket dashboard',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Dashboard link has been copied to clipboard.",
      });
    }
  };

  const handleExport = () => {
    if (data.length === 0) return;
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `support-tickets-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export complete!",
      description: "Ticket data has been downloaded as CSV.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        <DashboardHeader
          isLoading={isLoading}
          lastUpdated={lastUpdated}
          onRefresh={refresh}
          onExport={handleExport}
          onShare={handleShare}
        />

        {/* KPI Cards */}
        {kpis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Tickets"
              value={kpis.totalTickets}
              icon={TicketCheck}
              variant="default"
            />
            <KPICard
              title="Pending Tickets"
              value={kpis.pendingTickets}
              icon={Clock}
              variant={kpis.pendingTickets > 0 ? "warning" : "success"}
            />
            <KPICard
              title="Completed Tickets"
              value={kpis.completedTickets}
              icon={CheckCircle}
              variant="success"
            />
            <KPICard
              title="Avg Resolution Time"
              value={`${kpis.avgResolutionTime} days`}
              icon={AlertCircle}
              variant="default"
            />
          </div>
        )}

        {/* Charts */}
        {teamData.length > 0 && statusData.length > 0 && (
          <TicketsChart
            teamData={teamData}
            statusData={statusData}
            timeSeriesData={timeSeriesData}
          />
        )}

        {/* Data Table */}
        <TicketsTable data={data} />

        {/* Loading State */}
        {isLoading && data.length === 0 && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="space-y-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;