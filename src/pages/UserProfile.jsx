import React, {useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../api/user';

import DailyActivityBarChart from '../components/d3/DailyActivityBarChart';
import AverageSessionsLineGraph from '../components/d3/AverageSessionsLineGraph';
import PerformanceRadarChart from '../components/d3/PerformanceRadarChart';
import TodayScoreRingChart from '../components/d3/TodayScoreRingChart';
import StatCounter from '../components/StatCounter';

/**
 * @description UserProfile component to display user profile information and charts.
 * @returns {JSX.Element} The rendered component.
 */

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [achieveYesterdayGoal, setAchieveYesterdayGoal] = React.useState(true);

    /**
     * @description Fetch user data from the API
     * 
     * @async
     * @function fetchUser
     * @returns {Promise<void>} A promise that resolves to the user data.
     */

    useEffect(() => {
        const fetchUser = async () => {
            getUserById(id)
                .then((data) => {
                    console.log('Fetched user data:', data);
                    setUser(data);
                })
                .catch((error) => {
                    console.error("Failed to fetch user data:", error);
                    setError(true)
                })
                .finally(() => {
                    setLoading(false);
                });
        };
        fetchUser();
    }, [id]);

    const statCounters = [
        { className: "calories", value: user?.data.keyData.calorieCount + "KCal", label: "Calories" },
        { className: "proteins", value: user?.data.keyData.proteinCount + "g", label: "Proteins" },
        { className: "carbs", value: user?.data.keyData.carbohydrateCount + "g", label: "Carbos" },
        { className: "lipids", value: user?.data.keyData.lipidCount + "g", label: "Lipids" }
    ];

    return (
        <>
            {loading && <div>Loading...</div>}
            {error && <div>Failed to fetch user data</div>}
            {user && (
                <>
                    <div className='greeting'>
                        <h1 className='greeting__message'>Hello&nbsp;
                            <span className='greeting__name'>
                                {user.data.userInfos.firstName}
                            </span>
                        </h1>
                        {achieveYesterdayGoal && (
                            <p className='greeting__achieve-goal'>
                                Congratulations! You achieved yesterday's goal!👏
                            </p>
                        )}
                    </div>
                    <div className='graph-grid'>
                        <div className='graph-grid__chart-item graph-grid__chart-item--daily-activity-chart'>
                            <DailyActivityBarChart userId={id} />
                        </div>
                        <div className='graph-grid__chart-item graph-grid__chart-item--session-speed-chart'>
                            <AverageSessionsLineGraph userId={id} />
                        </div>
                        <div className='graph-grid__chart-item graph-grid__chart-item--performance-chart'>
                            <PerformanceRadarChart userId={id} />
                        </div>
                        <div className='graph-grid__chart-item graph-grid__chart-item--today-score-chart'>
                            <TodayScoreRingChart score={user.data.todayScore} />
                        </div>
                       { statCounters.map((counter, index) => (
                            <StatCounter
                                key={index}
                                className={counter.className}
                                value={counter.value}
                                label={counter.label}
                            />
                        )) }
                    </div>
                </>
            )}
        </>
    );
};

export default UserProfile;