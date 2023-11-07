import { useState } from 'react';
import logo from '../../assets/logo_nobg.png';
import lightLogo from '../../assets/lightlogo.png'
import '../../styles/custom-buttons.css';
import { setTheme, isDarkTheme } from '../../helpers/themeHelper';
import {NavLink} from "react-router-dom";

const Navbar = () => {
    const [isDark, setIsDark] = useState<boolean>(isDarkTheme());
    // when click on change button change theme
    const handleButtonClick = () => {
        setIsDark(!isDark);
        setTheme( isDarkTheme() ? 'light' : 'dark');
    }

    return (
        <>
            <nav  className="navbar navbar-expand-lg bg-body-tertiary" >
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/">
                        <img src={isDark?logo:lightLogo} alt="TeacherHub" className="img-fluid" width={180} height={190}></img>
                    </NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav ">
                            
                            <li className="nav-item ">
                                <NavLink to='/' className="btn-outline-orange btn">Register</NavLink>
                            </li>
                            <button onClick={handleButtonClick} className="btn rounded-fill">
                                { isDark ? <i className="bi bi-moon-fill"></i> : <i className="bi bi-sun-fill" style={{color: "yellow"}}></i>}
                 
                            </button>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
export default Navbar;