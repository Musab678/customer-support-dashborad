import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  className?: string;
}

const variantStyles = {
  default: 'border-border/50',
  success: 'border-success/30 bg-success/5',
  warning: 'border-warning/30 bg-warning/5',
  destructive: 'border-destructive/30 bg-destructive/5'
};

const iconVariantStyles = {
  default: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive'
};

export function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className 
}: KPICardProps) {
  return (
    <Card className={cn(
      'glass-card p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group',
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold tracking-tight animate-scale-in">
              {value}
            </h3>
            {trend && (
              <span className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                trend.value > 0 
                  ? 'text-success bg-success/10' 
                  : 'text-destructive bg-destructive/10'
              )}>
                {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
              </span>
            )}
          </div>
        </div>
        <div className={cn(
          'p-3 rounded-lg bg-background/50 transition-all duration-300 group-hover:scale-110 group-hover:bg-background/70',
          iconVariantStyles[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}