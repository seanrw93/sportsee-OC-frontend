
/**
 * @description Fetches user score data by id
 * 
 * @param {number} id 
 * @returns {Promise<number>}
 * @throws {Error}
 */

export const getUserTodayScore = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/user/${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching requests: ${response.statusText}`);
        }
        const data = await response.json();
        return data.todayScore;
    } catch (error) {
        console.error(error);
    }
};