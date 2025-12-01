import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Signup.css"; // ⬅️ NEW

export default function Signup() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    function handleChange(e) {
        setForm({...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");

        try {
            const success = await signup(form.name, form.email, form.password);
            if (success) navigate("/login");
            else setMessage("Sign up failed. Try again.");
        } catch {
            setMessage("Error creating account.");
        }
    }

    return ( <
        div className = "signup-wrapper" >
        <
        div className = "signup-card" >
        <
        h2 > Create Account < /h2>

        <
        form onSubmit = { handleSubmit } >
        <
        label > Name < /label> <
        input name = "name"
        type = "text"
        placeholder = "Enter your name"
        value = { form.name }
        onChange = { handleChange }
        required /
        >

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
        placeholder = "Create a password"
        value = { form.password }
        onChange = { handleChange }
        required /
        >

        {
            message && < p className = "form-message" > { message } < /p>}

            <
            button className = "btn-signup" > Sign Up < /button>

            <
            p className = "login-text" >
            Already have an account ? < Link to = "/login" > Login < /Link> <
            /p> <
            /form> <
            /div> <
            /div>
        );
    }