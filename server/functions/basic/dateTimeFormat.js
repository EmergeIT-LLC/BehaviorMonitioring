const { parse, format } = require('date-fns');
const pattern = 'yyyy-MM-dd';

async function dateTimeFormat(dateTime) {
    // Parse the input date string
    const parsedDate = parse(dateTime, pattern, new Date());

    // Format the parsed date to ensure the format
    return format(parsedDate, pattern);
}

async function formatDateString(date) {
    return format(date, pattern);
}

module.exports = {
    dateTimeFormat,
    formatDateString
}