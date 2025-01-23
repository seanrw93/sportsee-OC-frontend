import React from 'react';
import PropTypes from 'prop-types';

const DailyActivityGraph = ({ data }) => {
    return (
        <div>
            <h2>Daily Activity</h2>
            {/* Graph rendering logic will go here */}
        </div>
    );
};

DailyActivityGraph.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            date: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default DailyActivityGraph;