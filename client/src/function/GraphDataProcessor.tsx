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

    // Function to generate date range based on selected range (daily or monthly)
    const generateDateRange = () => {
        const dates = [];
        const now = new Date();
    
        if (dateRange >= 30) {
            const monthOffset = Math.floor(dateRange / 30); // Calculate the number of months to include (rounded down)
            
            // Adjust the range to include the last `monthOffset` months
            for (let i = monthOffset; i >= 0; i--) {
                const monthDate = new Date(now);
                monthDate.setMonth(now.getMonth() - i);
                // Formatting the date as "Month Year" (e.g., "Nov 2024")
                dates.push(new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short' }).format(monthDate));
            }
        } else {
            // For daily range, include days from pastDate to now
            const pastDate = new Date();
            pastDate.setDate(now.getDate() - dateRange);
            let currentDate = new Date(pastDate);
    
            while (currentDate <= now) {
                dates.push(currentDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
    
        return dates;
    };
                        
    const formattedDateRange = generateDateRange();

    // Function to format date based on the range
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return dateRange >= 30 ? new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short' }).format(date) 
        : 
        date.toISOString().split('T')[0];
    };

    // Step 1: Aggregate data by behaviorID and formatted date
    const aggregatedData = fetchedData.reduce((acc, entry) => {
        const { bsID, sessionDate, count, duration } = entry;
        const formattedDate = formatDate(sessionDate);

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

    // Step 3: Prepare datasets and fill in missing dates with zero
    const datasets = Object.entries(groupedByBehavior).map(([behaviorID, dateData], index) => {
        const data = formattedDateRange.map((label) => {
            return label in dateData ? dateData[label] : 0; // Fill missing data with zero
        });
    
        return {
            label: behaviorNames[Number(behaviorID)] || `Behavior ${behaviorID}`,
            data,
            backgroundColor: colors[index % colors.length],
            borderColor: colors[index % colors.length],
            borderWidth: 2,
            fill: false,
            tension: 0.4,
        };
    });
    
    // Step 4: Prepare the graphData object to pass to GraphComponent
    const graphData = { labels: formattedDateRange, datasets, title, measurementType };

    console.log('Aggregated Data:', aggregatedData);
console.log('Grouped by Behavior:', groupedByBehavior);
console.log('Datasets:', datasets);

    return <GraphComponent data={graphData} />;
    
};

export default GraphDataProcessor;