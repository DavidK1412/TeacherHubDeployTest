import React, { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
import  { isValidEmail } from "../../utils/inputValidators";
import { showAlert } from "../../utils/alertPrompts";
import { axiosInstance, postData } from "../../api";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../../interfaces/token";
import { isDarkTheme } from "../../helpers/themeHelper.ts";
import "../../styles/login.css"
const LogIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    
    useEffect(() => {
        updateStyles();
    }, []);

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true)
        if (!isValidEmail(email)) {
            showAlert(
                {
                    icon: 'error',
                    title: 'Not valid email',
                    text: 'Please, use your @udistrital.edu.co email',
                    buttonText: 'Ok',
                }
            )
            return;
        }

        postData(
            axiosInstance,
            '/auth/login',
            {
                email,
                password,
            },
            {}
        ).then(({ data, status }) => {
            if ( status === 200 ) {
                setLoading(false)
                if (data.token) {
                    const token = data.token;
                    const jwtDecodedData = jwtDecode(token) as DecodedToken;
                    localStorage.setItem('token', token);

                    if (jwtDecodedData.user_role === "ADMIN") navigate("/home-admin");
                    if (jwtDecodedData.user_role === "USER") navigate("/home-user");
                }
            }
        }).catch(() => {
            setLoading(false)
            showAlert(
                {
                    icon: 'error',
                    title: 'Error',
                    text: 'Please, check your email and password',
                    buttonText: 'Ok',
                }
            )
        })
    };
    const updateStyles = () => {
        const container = document.querySelector(".container");
        if (container) {
            container.classList.toggle("dark-theme", isDarkTheme());
            container.classList.toggle("light-theme", !isDarkTheme());
        }
    };
    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div className="form_group">
                    <input
                        type="email"
                        className="form_input"
                        id="email"
                        placeholder=" "
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <label className="form_label">Email</label>
                </div>
                <div className="form_group">
                    <input
                        type="password"
                        className="form_input"
                        id="password"
                        placeholder=" "
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <label className="form_label">Password</label>
                </div>

                    <button type="submit" className="form_button">Log In</button>
                <div className='d-flex align-items-center justify-content-center'>
                    <Link to='/recovery-password'>forget your password?</Link>
                </div>
                {
                    loading && (
                        <div className='d-flex align-items-center justify-content-center'>
                            <p className='text-center'>Loading...</p>
                        </div>
                    )
                }
            </form>
        </div>
    );
};

export default LogIn;
