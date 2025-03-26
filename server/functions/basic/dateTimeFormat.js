const { parse, format } = require('date-fns');
const pattern = 'yyyy-MM-dd';
const timePattern = 'HH:mm';
const outputTimePattern = 'hh:mm:ss a';

async function dateTimeFormat(dateTime) {
    // Parse the input date string
    const parsedDate = parse(dateTime, pattern, new Date());

    // Format the parsed date to ensure the format
    return format(parsedDate, pattern);
}

async function formatDateString(date) {
    return format(date, pattern);
}

async function formatTimeString(time) {
    const parsedTime = parse(time, timePattern, new Date());
    return `${format(parsedTime, outputTimePattern)} EST`;
}

module.exports = {
    dateTimeFormat,
    formatDateString,
    formatTimeString
}