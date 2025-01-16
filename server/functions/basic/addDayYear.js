async function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

async function addYears(date, years) {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
}

module.exports = {
    addDays,
    addYears
}