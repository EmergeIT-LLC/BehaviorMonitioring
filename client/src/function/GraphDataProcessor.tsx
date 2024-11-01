// GraphDataProcessor.tsx
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
    behaviorNames: Record<number, string>; // New property to map behavior IDs to names
}

// GraphDataProcessor.tsx
const GraphDataProcessor: React.FC<GraphDataProcessorProps> = ({ fetchedData, behaviorNames }) => {

    if (fetchedData.length === 0) {
        return <p>Loading data...</p>;
    }

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    // Step 1: Aggregate data by behaviorID and sessionDate
    const aggregatedData = fetchedData.reduce((acc, entry) => {
        const { bsID, sessionDate, count } = entry;
        const key = `${bsID}-${sessionDate}`;
        if (!acc[key]) {
            acc[key] = { behaviorID: bsID, sessionDate, count: 0 };
        }
        acc[key].count += count;
        return acc;
    }, {} as Record<string, { behaviorID: number, sessionDate: string, count: number }>);

    // Step 2: Group aggregated data by behaviorID
    const groupedByBehavior = Object.values(aggregatedData).reduce((acc, { behaviorID, sessionDate, count }) => {
        if (!acc[behaviorID]) acc[behaviorID] = {};
        acc[behaviorID][sessionDate] = count;
        return acc;
    }, {} as Record<number, Record<string, number>>);

    // Step 3: Extract unique session dates for labels
    const labels = Array.from(new Set(fetchedData.map((entry) => entry.sessionDate))).sort();

    // Step 4: Generate datasets for each behavior with unique colors
    const datasets = Object.entries(groupedByBehavior).map(([behaviorID, dateData], index) => ({
        label: behaviorNames[Number(behaviorID)] || `Behavior ${behaviorID}`,  // Ensure behaviorID is correctly referenced
        data: labels.map((date) => (dateData as Record<string, number>)[date] || 0),
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 2,
        fill: false,
        tension: 0.4,
    }));

    const graphData = { labels, datasets };

    return <GraphComponent data={graphData} />;
};

export default GraphDataProcessor;