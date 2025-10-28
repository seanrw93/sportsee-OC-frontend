/**
 * @description Represents performance kind data
 * 
 * @typedef {Object.<number, string>} Kind
 */

/**
 * @description Represents performance data point
 * 
 * @typedef {Object} PerformanceData
 * @property {number} value
 * @property {number} kind
 */

/**
 * @description Represents performance data for a user
 * 
 * @typedef {Object} Performance
 * @property {number} userId
 * @property {Kind} kind
 * @property {PerformanceData[]} data
 */

/**
 * @description Fetches performance data for a user
 * 
 * @param {number} id
 * @returns {Promise<Performance>}
 * @throws {Error}
 */

export const getPerformanceData = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/user/${id}/performance`);
        if (!response.ok) {
            throw new Error(`Error fetching requests: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};