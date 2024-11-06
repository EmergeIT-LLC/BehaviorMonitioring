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
    labels: string[];  // Session dates
    datasets: Dataset[];
    title: string;
    measurementType: string;  // 'Rate', 'Duration', or 'Count'
}

const LineGraph: React.FC<{ data: ChartData }> = ({ data }) => {
    // Setup chart data with labels (session dates) and datasets
    const chartData = {
        labels: data.labels,  // X-axis will represent session dates or time
        datasets: data.datasets.map(dataset => ({
            ...dataset,
            tension: 0, // Straight lines, no curve
            fill: false, // No fill under the line
        })),
    };

    // Set axis labels based on measurement type
    const yAxisLabel = data.measurementType === 'Rate'
        ? 'Rate (behaviors per minute)' 
        : (data.measurementType === 'Duration' ? 'Duration (mins)' : 'Count');

    const xAxisLabel = data.measurementType === 'Rate' 
        ? 'Date' // For Rate, X-axis is session date
        : 'Date'; // For Duration/Count, X-axis is also session date (no need for duration here)

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' as const },
            title: { display: true, text: data.title },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxisLabel, // X-axis will always be Date (session date)
                },
                ticks: {
                    maxRotation: 90,
                    minRotation: 90,
                },
            },
            y: {
                title: {
                    display: true,
                    text: yAxisLabel, // Y-axis depends on measurementType
                },
            },
        },
    };

    // If no data, display message
    if (!data.labels.length || !data.datasets.length) {
        return <p>No data available for the selected behavior.</p>;
    }

    // Render the Line chart with chartData and options
    return (
        <Line data={chartData} options={options} />
    );
};

export default LineGraph;