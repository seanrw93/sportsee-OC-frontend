import React, {useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DailyActivityGraph from '../components/DailyActivityGraph';
import { getUserById } from '../api/user';

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = React.useState(null);

    /**
     * @description Fetch user data from the API
     * 
     * @function fetchUser
     * @returns {Promise<void>}
     */

    useEffect(() => {
        const fetchUser = async () => {
            getUserById(id)
                .then((data) => {
                    setUser(data);
                })
                .catch((error) => {
                    console.error("Failed to fetch user data:", error);
                });
        };
        fetchUser();
    }, [id]);

    return (
        <>
            <DailyActivityGraph data={[]} />
        </>
    );
};

export default UserProfile;