import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TooltipItem, LegendItem } from 'chart.js';
import annotationPlugin, { AnnotationOptions } from 'chartjs-plugin-annotation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

interface Dataset {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
}

interface ChartData {
    labels: string[]; //Session dates
    datasets: Dataset[];
    title: string;
    measurementType: string; //'Rate', 'Duration', or 'Count'
}

const LineGraph: React.FC<{ data: ChartData; average: number }> = ({ data, average }) => {
    const averages = data.datasets.map((dataset) => {
        const total = dataset.data.reduce((sum, value) => sum + value, 0);
        return total / dataset.data.length;
    });

    // Create a dataset for the average line with a single marker in the middle
    const avgDataset = averages.map((avg, index) => {
        const midIndex = Math.floor(data.labels.length / 2); // Find the middle index
        const avgData = new Array(data.labels.length).fill(avg); // Fill the array with the average value

        // Add a single marker at the middle index
        avgData[midIndex] = avg;

        return {
            label: `${data.datasets[index].label} Avg`,
            data: avgData, // Data for the average line with a marker at the center
            borderColor: data.datasets[index].borderColor || 'gray',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [6, 6], // Optional dashed line style
            pointRadius: 5, // Make the points a bit larger
            pointBackgroundColor: 'transparent', // Make the points transparent
            pointBorderColor: data.datasets[index].borderColor || 'gray', // Make the point border color visible
            // Hides the legend for the average line
            legend: {
                display: false,
            },
        };
    });

    const annotations = averages.reduce((acc, avg, index) => {
        acc[`averageLine-${index}`] = {
            type: 'line',
            yMin: avg,
            yMax: avg,
            borderColor: data.datasets[index].borderColor || 'gray',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
                enabled: true,
                content: `${data.datasets[index].label} Avg: ${avg.toFixed(2)}`,
                position: 'end',
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
            },
        } as AnnotationOptions<'line'>;
        return acc;
    }, {} as Record<string, AnnotationOptions<'line'>>);

    const chartData = {
        labels: data.labels,
        datasets: [
            ...data.datasets.map((dataset) => ({
                ...dataset,
                tension: 0,
                fill: false,
            })),
            ...avgDataset,
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    filter: (legendItem: LegendItem) => !legendItem.text.includes('Avg'),
                },
            },
            title: { display: true, text: data.title },
            annotation: {
                annotations,
            },
            tooltip: {
                callbacks: {
                    label: (context: TooltipItem<'line'>) => {
                        const datasetLabel = context.dataset.label || '';
                        const value = context.raw as number || 0;
                        if (!datasetLabel.includes('Avg')) {
                            return `${datasetLabel}: ${value}`;
                        }
                        return `${datasetLabel}: ${value.toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: data.measurementType,
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default LineGraph;