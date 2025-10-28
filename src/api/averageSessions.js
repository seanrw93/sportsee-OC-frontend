/**
 * @description Represents each recent user session
 * 
 * @typedef {Object} IndividualSession
 * @property {number} day
 * @property {number} sessionLength
 */

/**
 * @description Represents recent session data for a user
 * 
 * @typedef {Object} UserSessionData
 * @property {number} userId
 * @property {IndividualSession[]} sessions
 */

/**
 * @description Fetches recent session data for a user
 * 
 * @param {number} id
 * @returns {Promise<UserSessionData>}
 * @throws {Error}
 */

export const getAverageSessions = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/user/${id}/average-sessions`);
        if (!response.ok) {
            throw new Error(`Error fetching requests: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};