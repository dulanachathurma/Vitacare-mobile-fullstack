import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useI18n } from '../utils/i18nTranslations.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

/** Line chart of BMI over time with the healthy range (18.5 - 24.9) as dashed guides. */
export default function BmiChart({ logs }) {
  const { t } = useI18n();

  const labels = logs.map((log) =>
    new Date(log.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  );

  const guideLine = (value, label) => ({
    label,
    data: logs.map(() => value),
    borderColor: '#34d399',
    borderDash: [6, 6],
    borderWidth: 1.5,
    pointRadius: 0,
    fill: false,
  });

  const data = {
    labels,
    datasets: [
      {
        label: t('dashboard.bmi'),
        data: logs.map((log) => log.bmi),
        borderColor: '#0d9488',
        backgroundColor: 'rgba(13, 148, 136, 0.15)',
        borderWidth: 2.5,
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#0d9488',
      },
      guideLine(24.9, t('dashboard.healthyRange')),
      guideLine(18.5, ''),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: { size: 11 },
          // hide the legend entry of the lower guide line
          filter: (item) => item.datasetIndex !== 2,
        },
      },
    },
    scales: {
      y: { suggestedMin: 15, suggestedMax: 35, ticks: { font: { size: 10 } } },
      x: { ticks: { font: { size: 10 } }, grid: { display: false } },
    },
  };

  return (
    <div className="h-56">
      <Line data={data} options={options} />
    </div>
  );
}
