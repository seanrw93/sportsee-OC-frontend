import React from 'react';
import propTypes from 'prop-types';

const StatCounter = ({ className, value, label }) => {
    return (
        <div className={`graph-grid__stat-card graph-grid__stat-card--${className}`}>
            <div className="stat-card__container">
                <div className="stat-card__icon"></div>
                <div className="stat-card__data">
                    <p className="stat-card_value">{ value }</p>
                    <p className="stat-card__label">{ label }</p>
                </div>
            </div>
        </div>
    );
};

StatCounter.propTypes = {
    className: propTypes.string,
    value: propTypes.number,
    label: propTypes.string,
};

export default StatCounter;