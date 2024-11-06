// Modify GraphDataProcessor.tsx
import React from 'react';
import GraphComponent from '../components/LineGraph';

interface FetchedDataEntry {
    bsID: number;
    behaviorID: number;
    sessionDate: string;
    count: number;
    duration?: string;
    trial?: number;
}

interface GraphDataProcessorProps {
    fetchedData: FetchedDataEntry[];
    behaviorNames: Record<number, string>;
    title: string;
    measurementType: string;
    dateRange: number; // Pass the date range for conditional formatting
}

const GraphDataProcessor: React.FC<GraphDataProcessorProps> = ({ fetchedData, behaviorNames, title, measurementType, dateRange }) => {
    if (fetchedData.length === 0) {
        return <p>Loading data...</p>;
    }

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    
    // Function to format date as either daily or monthly based on range
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return dateRange >= 90 ? new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short' }).format(date) : dateStr;
    };

    // Step 1: Aggregate data by behaviorID and formatted date (month if dateRange >= 90)
    const aggregatedData = fetchedData.reduce((acc, entry) => {
        const { bsID, sessionDate, count, duration } = entry;
        const formattedDate = formatDate(sessionDate); // Format date based on range

        let rate = 0;
        if (measurementType === 'Rate' && duration && count) {
            rate = parseFloat(duration) > 0 ? count / parseFloat(duration) : 0;
        }

        const key = `${bsID}-${formattedDate}`;
        if (!acc[key]) {
            acc[key] = { behaviorID: bsID, sessionDate: formattedDate, rate: 0, count: 0, duration: 0 };
        }
        acc[key].rate += rate;
        acc[key].count += count;
        acc[key].duration += duration ? parseFloat(duration) : 0;

        return acc;
    }, {} as Record<string, { behaviorID: number, sessionDate: string, rate: number, count: number, duration: number }>);

    // Step 2: Group aggregated data by behaviorID
    const groupedByBehavior = Object.values(aggregatedData).reduce((acc, { behaviorID, sessionDate, rate, count, duration }) => {
        if (!acc[behaviorID]) acc[behaviorID] = {};

        acc[behaviorID][sessionDate] = measurementType === 'Rate' ? rate : (measurementType === 'Duration' ? duration : count);

        return acc;
    }, {} as Record<number, Record<string, number>>);

    // Step 3: Extract unique session dates for labels (X-axis)
    const labels = Array.from(new Set(Object.values(aggregatedData).map((entry) => entry.sessionDate))).sort();

    // Step 4: Generate datasets for each behavior with unique colors
    const datasets = Object.entries(groupedByBehavior).map(([behaviorID, dateData], index) => ({
        label: behaviorNames[Number(behaviorID)] || `Behavior ${behaviorID}`,
        data: labels.map((label) => dateData[label] || 0),
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 2,
        fill: false,
        tension: 0.4,
    }));

    // Step 5: Prepare the graphData object to pass to GraphComponent
    const graphData = { labels, datasets, title, measurementType };

    return <GraphComponent data={graphData} />;
};

export default GraphDataProcessor;