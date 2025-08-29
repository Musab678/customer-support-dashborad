import { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TicketData } from '@/types/dashboard';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TicketsTableProps {
  data: TicketData[];
}

export function TicketsTable({ data }: TicketsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');

  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(data.map(ticket => ticket.Status).filter(Boolean))];
    return statuses;
  }, [data]);

  const uniqueTeams = useMemo(() => {
    const teams = [...new Set(data.map(ticket => ticket["Assigned Team"]).filter(Boolean))];
    return teams;
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(ticket => {
      const matchesSearch = 
        ticket["Ticket ID"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket["Customer Email"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket["Category (Auto)"]?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || ticket.Status === statusFilter;
      const matchesTeam = teamFilter === 'all' || ticket["Assigned Team"] === teamFilter;

      return matchesSearch && matchesStatus && matchesTeam;
    });
  }, [data, searchTerm, statusFilter, teamFilter]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'default';
      case 'open':
        return 'destructive';
      case 'in progress':
        return 'secondary';
      case 'new':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'text-destructive';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-accent';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Tickets Overview
        </CardTitle>
        <CardDescription>
          Showing {filteredData.length} of {data.length} tickets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets, emails, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {uniqueStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {uniqueTeams.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/30">
                <TableHead className="font-semibold">Ticket ID</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Team</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((ticket, index) => (
                <TableRow 
                  key={ticket["Ticket ID"] || index} 
                  className="hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="font-mono text-sm">
                    {ticket["Ticket ID"]}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {ticket["Customer Email"]}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {ticket["Category (Auto)"]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {ticket["Assigned Team"]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "font-medium text-sm",
                      getPriorityColor(ticket.Priority)
                    )}>
                      {ticket.Priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(ticket.Status)}>
                      {ticket.Status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(ticket["Date Created"]).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No tickets match your current filters.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}