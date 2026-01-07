import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { velocityData } from '@/data/mockData';

const VelocityChart = () => {
  return (
    <div className="masira-card masira-slide-up" style={{ animationDelay: '700ms' }}>
      <h3 className="font-semibold text-foreground mb-4">Team Velocity</h3>
      
      <div className="h-48 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={velocityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value} story points`, 'Completed']}
            />
            <Bar
              dataKey="value"
              fill="hsl(239, 84%, 67%)"
              radius={[4, 4, 0, 0]}
              name="Story Points"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-secondary/30">
        <div className="flex items-center justify-between text-xs md:text-sm">
          <span className="text-muted-foreground">Average velocity</span>
          <span className="font-semibold text-foreground">54.7 pts/week</span>
        </div>
      </div>
    </div>
  );
};

export default VelocityChart;
