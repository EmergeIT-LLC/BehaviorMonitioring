// GraphDataProcessor.tsx
import React from 'react';
import GraphComponent from '../components/LineGraph';

interface GraphDataProcessorProps {
    fetchedData: any[]; // Define the type based on the expected data structure
}

const getUniqueSessionDates = (data: any[]) => {
    const uniqueDates: string[] = [];
    data.forEach(entry => {
        if (!uniqueDates.includes(entry.sessionDate)) {
            uniqueDates.push(entry.sessionDate);
        }
    });
    return uniqueDates;
};

const GraphDataProcessor: React.FC<GraphDataProcessorProps> = ({ fetchedData }) => {
    // Process the fetchedData to create chart data
    const graphData = {
        labels: getUniqueSessionDates(fetchedData), // Unique session dates
        datasets: [
            {
                label: 'Behavior Data',
                data: fetchedData.map(entry => entry.trial), // Adjust as per your data structure
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    return <GraphComponent data={graphData} />;
};

export default GraphDataProcessor;