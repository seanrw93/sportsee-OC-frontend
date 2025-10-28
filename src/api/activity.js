/**
 * @description Represents an activity session
 * 
 * @typedef {Object} Session
 * @property {string} day
 * @property {number} weight
 * @property {number} calories
 */

/**
 * @description Represents activity data for a user
 * 
 * @typedef {Object} Activity
 * @property {number} userId
 * @property {Session[]} sessions
 */

/**
 * @description Fetches activity data for a user
 * 
 * @param {number} id 
 * @returns {Promise<Activity>}
 * @throws {Error}
 */


export const getActivities = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/user/${id}/activity`);
        if (!response.ok) {
            throw new Error(`Error fetching requests: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};