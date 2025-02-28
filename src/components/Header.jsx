import Logo from "../assets/images/logo.svg";

/**
 * @description Header component
 * 
 * @returns {JSX.Element}
 */

const Header = () => {
    return (
        <header className="header">
            <div className="header__container">
                <nav className="header__nav">
                    <a href="#" className="header__logo">
                        <img src={Logo} alt="Vite" />
                    </a>
                    <a href="#" className="header__nav-link">Home</a>
                    <a href="#" className="header__nav-link">Profile</a>
                    <a href="#" className="header__nav-link">Settings</a>
                    <a href="#" className="header__nav-link">Community</a>
                </nav>
            </div>
        </header>
    );
}

export default Header;