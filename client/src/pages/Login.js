import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Login.css";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

    function handleChange(e) {
        setForm({...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");

        try {
            const success = await login(form.email, form.password);
            if (success) navigate("/");
            else setMessage("Invalid email or password.");
        } catch {
            setMessage("Login failed. Try again.");
        }
    }

    return ( <
        div className = "login-wrapper" >
        <
        div className = "login-card" >
        <
        h2 > Welcome Back < /h2>

        <
        form onSubmit = { handleSubmit } >

        <
        label > Email < /label> <
        input name = "email"
        type = "email"
        placeholder = "Enter your email"
        value = { form.email }
        onChange = { handleChange }
        required /
        >

        <
        label > Password < /label> <
        input name = "password"
        type = "password"
        placeholder = "Enter your password"
        value = { form.password }
        onChange = { handleChange }
        required /
        >

        {
            message && < p className = "form-message" > { message } < /p>}

            <
            button type = "submit"
            className = "btn-login" >
            Login <
            /button>

            <
            p className = "signup-text" >
            Don’ t have an account ? < Link to = "/signup" > Sign up < /Link> <
            /p>

            <
            /form> <
            /div> <
            /div>
        );
    }