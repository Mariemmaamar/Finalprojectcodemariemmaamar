import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Home.css";
import bg from "../assets/home.jpg";

export default function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();

    function handleGetStarted() {
        if (user) {
            navigate("/recipes");
        } else {
            navigate("/signup");
        }
    }

    return ( <
        div className = "hero"
        style = {
            { backgroundImage: `url(${bg})` } } >

        { /* Decorative Blobs */ } <
        div className = "blob blob1" > < /div> <
        div className = "blob blob2" > < /div>

        { /* Navigation */ } <
        header className = "nav" >
        <
        h1 className = "logo" > NutriTrack < /h1> <
        nav >
        <
        NavLink to = "/"
        end > Home < /NavLink> <
        NavLink to = "/recipes" > Recipes < /NavLink> <
        NavLink to = "/planner" > Planner < /NavLink> <
        /nav> <
        /header>

        { /* Hero Section */ } <
        div className = "hero-box" >
        <
        div className = "hero-content" >
        <
        h2 className = "fade-h" > Mindful Eating Starts Here < /h2>

        <
        p className = "fade-p" >
        Enjoy a warm, editorial, magazine - like atmosphere designed to make your wellness journey feel soft, cozy, and beautiful. <
        /p>

        <
        button className = "hero-btn fade-btn"
        onClick = { handleGetStarted } >
        { user ? "Explore Recipes" : "Get Started" } <
        /button> <
        /div> <
        /div>

        <
        /div>
    );
}