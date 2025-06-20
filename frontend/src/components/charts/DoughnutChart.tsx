
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth?: number;
    }>;
  };
  height?: number;
}

export function DoughnutChart({ title, data, height = 400 }: DoughnutChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            const dataset = context.dataset;
            const total = dataset.data.reduce((acc: number, val: number) => acc + val, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          }
        }
      },
    },
    cutout: '65%',
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div style={{ height: `${height}px` }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}