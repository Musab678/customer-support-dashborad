import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Download, 
  Share2, 
  Activity,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  isLoading: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
  onExport?: () => void;
  onShare?: () => void;
}

export function DashboardHeader({ 
  isLoading, 
  lastUpdated, 
  onRefresh, 
  onExport, 
  onShare 
}: DashboardHeaderProps) {
  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Card className="glass-card p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Support Dashboard
              </h1>
              <p className="text-muted-foreground">
                Real-time ticket management and analytics
              </p>
            </div>
          </div>
          
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
              <Badge variant="outline" className="text-xs">
                Auto-refresh: 1h
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className={cn(
              "h-4 w-4 mr-2", 
              isLoading && "animate-spin"
            )} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="transition-all duration-200 hover:scale-105"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          
          {onShare && (
            <Button
              variant="default"
              size="sm"
              onClick={onShare}
              className="bg-gradient-primary hover:opacity-90 transition-all duration-200 hover:scale-105"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}