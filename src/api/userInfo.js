/**
 * @description Represents personal user information
 * 
 * @typedef {Object} UserInfo
 * @property {string} firstName
 * @property {string} lastName
 * @property {number} age
 */

/**
 * @description Fetches user data by id
 * 
 * @param {number} id 
 * @returns {Promise<UserInfo>}
 * @throws {Error}
 */

export const getUserInfo = async (id) => {
    try {
        const response = await fetch(`https://sportsee-backend-j2dr.onrender.com/user/${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching requests: ${response.statusText}`);
        }
        const data = await response.json();
        return data.userInfos;
    } catch (error) {
        console.error(error);
    }
};