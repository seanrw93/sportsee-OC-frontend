import propTypes from 'prop-types';

/**
 * @typedef {Object} StatCounterProps
 * @property {string} className - The class name for the counter.
 * @property {string} value - The value to display.
 * @property {string} label - The label for the counter.
 */

/** 
 * @description A stat counter component
 * @param {StatCounterProps} props
 * @returns {JSX.Element} The stat counter component
 */

const StatCounter = ({ className, value, label }) => {
    return (
        <div className={`graph-grid__stat-card graph-grid__stat-card--${className}`}>
            <div className="stat-card__container">
                <div className="stat-card__icon"></div>
                <div className="stat-card__data">
                    <p className="stat-card__value">{ value }</p>
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