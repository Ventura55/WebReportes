import React, { useState } from "react";
import './LoginForm.css'
import { User, Key } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const response = await fetch("http://tareas.quirosingenieria.es:8081/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            navigate("/main", { state: { username, password } });
        } else {
            setError("Credenciales incorrectas");
        }
    };

    return (
        <div className="Login">
            <header className="Login-header">
                <form onSubmit={handleLogin}>
                    <div className="login-box">
                        <img src="/logoQuiros.png" with="280px" />
                        <br></br>
                        <div className="input-wrapper">
                            <div className="input-group">
                                <User className="w-4 h-4 mr-2 text-gray-300" />
                                <div className="divider"></div>
                                <input
                                    type="text"
                                    placeholder="Usuario"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="separator" />
                            <div className="input-group">
                                <Key className="w-4 h-4 mr-2 text-gray-300" />
                                <div className="divider"></div>
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <br />
                        <button className="login-button">ENTRAR</button>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </div>
                </form>
            </header>
        </div>
    );
}

export default LoginForm;