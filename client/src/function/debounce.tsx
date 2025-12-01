/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay (default: 300ms)
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number = 300
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;

    return function debounced(...args: Parameters<T>) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func(...args);
            timeoutId = null;
        }, wait);
    };
}

/**
 * Creates a debounced async function that returns a Promise.
 * Only the last call within the wait period will be executed.
 * 
 * @param func - The async function to debounce
 * @param wait - The number of milliseconds to delay (default: 300ms)
 * @returns A debounced version of the async function
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
    func: T,
    wait: number = 300
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
    let timeoutId: NodeJS.Timeout | null = null;
    let latestResolve: ((value: ReturnType<T>) => void) | null = null;
    let latestReject: ((reason?: any) => void) | null = null;

    return function debouncedAsync(...args: Parameters<T>): Promise<ReturnType<T>> {
        // Clear previous timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
            // Reject previous promise if it exists
            if (latestReject) {
                latestReject(new Error('Debounced call cancelled'));
            }
        }

        // Create new promise
        return new Promise<ReturnType<T>>((resolve, reject) => {
            latestResolve = resolve;
            latestReject = reject;

            timeoutId = setTimeout(async () => {
                try {
                    const result = await func(...args);
                    if (latestResolve) {
                        latestResolve(result);
                    }
                } catch (error) {
                    if (latestReject) {
                        latestReject(error);
                    }
                } finally {
                    timeoutId = null;
                    latestResolve = null;
                    latestReject = null;
                }
            }, wait);
        });
    };
}
