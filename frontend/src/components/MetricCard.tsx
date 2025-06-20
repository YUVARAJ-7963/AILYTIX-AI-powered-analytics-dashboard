
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const colorClasses = {
  blue: {
    icon: 'bg-blue-500/20 text-blue-300',
    accent: 'border-blue-500',
  },
  green: {
    icon: 'bg-green-500/20 text-green-300',
    accent: 'border-green-500',
  },
  orange: {
    icon: 'bg-orange-500/20 text-orange-300',
    accent: 'border-orange-500',
  },
  red: {
    icon: 'bg-red-500/20 text-red-300',
    accent: 'border-red-500',
  },
  purple: {
    icon: 'bg-purple-500/20 text-purple-300',
    accent: 'border-purple-500',
  },
};

export function MetricCard({ title, value, icon: Icon, color }: MetricCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={`bg-gray-800 rounded-xl p-5 border-l-4 ${colors.accent} transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${colors.icon} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}