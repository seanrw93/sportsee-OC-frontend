import React from 'react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <nav className="sidebar__nav">
                <ul className="sidebar__list">
                    <li className="sidebar__item">
                        <a className="sidebar__icon sidebar__icon--yoga" href="#"></a>
                    </li>
                    <li className="sidebar__item">
                        <a className="sidebar__icon sidebar__icon--swimming" href="#"></a>
                    </li>
                    <li className="sidebar__item">
                        <a className="sidebar__icon sidebar__icon--bicycle" href="#"></a>
                    </li>
                    <li className="sidebar__item">
                        <a className="sidebar__icon sidebar__icon--dumbbell" href="#"></a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;