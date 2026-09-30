import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useI18n } from '../utils/i18nTranslations.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const line = (label, data, color) => ({
  label,
  data,
  borderColor: color,
  backgroundColor: color,
  borderWidth: 2.5,
  tension: 0.35,
  pointRadius: 4,
});

/** Trend chart for one metric. Blood pressure draws two lines (systolic + diastolic). */
export default function MetricChart({ type, metrics }) {
  const { t } = useI18n();

  const labels = metrics.map((m) =>
    new Date(m.measuredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  );

  const datasets =
    type === 'bloodPressure'
      ? [
          line(t('metrics.systolic'), metrics.map((m) => m.value), '#e11d48'),
          line(t('metrics.diastolic'), metrics.map((m) => m.value2), '#0ea5e9'),
        ]
      : [line(t('metric.' + type), metrics.map((m) => m.value), '#0d9488')];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
    scales: {
      y: { ticks: { font: { size: 10 } } },
      x: { ticks: { font: { size: 10 } }, grid: { display: false } },
    },
  };

  return (
    <div className="h-52">
      <Line data={{ labels, datasets }} options={options} />
    </div>
  );
}
