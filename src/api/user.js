/**
 * @description Represents personal user information
 * 
 * @typedef {Object} UserInfo
 * @property {string} firstName
 * @property {string} lastName
 * @property {number} age
 */

/**
 * @description Represents key data for user 
 * 
 * @typedef {Object<string, number>} UserKeyData
 */

/**
 * @description Represents main user data
 * 
 * @typedef {Object} User
 * @property {number} id
 * @property {UserInfo} userInfos
 * @property {number} todayScore
 * @property {UserKeyData} keyData
 */

/**
 * @description Fetches user data by id
 * 
 * @param {number} id 
 * @returns {Promise<User>}
 * @throws {Error}
 */

export const getUserById = async (id) => {
    try {
        const response = await fetch(`https://sportsee-backend-j2dr.onrender.com/user/${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching requests: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};