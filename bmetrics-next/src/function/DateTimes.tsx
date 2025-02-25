export const getCurrentDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Returns 'YYYY-MM-DD'
};

export const getCurrentTime = (): string => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // returns 'HH:MM'
};
