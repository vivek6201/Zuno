/**
 * Utility to catch errors from a promise without verbose try/catch blocks.
 * Returns a tuple: [null, data] on success, or [error, null] on failure.
 *
 * @example
 * const [err, user] = await catchError(userRepo.getUserByEmail(email));
 * if (err) {
 *   // handle error
 * }
 */
export async function catchError<T, E = Error>(
    promise: Promise<T>
): Promise<[null, T] | [E, null]> {
    try {
        const data = await promise;
        return [null, data];
    } catch (error) {
        return [error as E, null];
    }
}

/**
 * Utility to catch errors from a synchronous function without try/catch blocks.
 * Returns a tuple: [null, data] on success, or [error, null] on failure.
 */
export function catchSync<T, E = Error>(
    fn: () => T
): [null, T] | [E, null] {
    try {
        const data = fn();
        return [null, data];
    } catch (error) {
        return [error as E, null];
    }
}
