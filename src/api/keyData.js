/**
 * @description Represents key data for user 
 * 
 * @typedef {Object<string, number>} UserKeyData
 */

/**
 * @description Fetches user data by id
 * 
 * @param {number} id 
 * @returns {Promise<UserKeyData>}
 * @throws {Error}
 */

export const getUserKeyData = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/user/${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching requests: ${response.statusText}`);
        }
        const data = await response.json();
        return data.keyData;
    } catch (error) {
        console.error(error);
    }
};