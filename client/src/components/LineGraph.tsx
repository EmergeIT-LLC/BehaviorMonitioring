import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define the data structure
interface Dataset {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
}

interface ChartData {
    labels: string[];
    datasets: Dataset[];
}

// Update the props interface
const LineGraph: React.FC<{ data: ChartData }> = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: data.datasets,
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' as const },
            title: { display: true, text: 'Behavior Over Last 3 Months' },
        },
    };

    // Return a fallback message if no data is available
    if (!data.labels.length || !data.datasets.length) {
        return <p>No data available for the selected behavior.</p>;
    }

    return <Line data={chartData} options={options} />;
}

export default LineGraph;