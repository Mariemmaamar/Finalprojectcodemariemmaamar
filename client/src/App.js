import React from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import AddRecipe from "./pages/AddRecipe";
import Planner from "./pages/Planner";
import Budget from "./pages/Budget";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import RecipeDetail from "./pages/RecipeDetail";

import { AuthProvider, useAuth } from "./AuthContext";
import "./App.css";

function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return ( <
        div className = "app" >

        { /* HEADER / NAVBAR */ } <
        header className = "header" >
        <
        div className = "nav-wrapper" >

        <
        div className = "logo" > NutriTrack < /div>

        <
        nav className = "nav" >
        <
        div className = "nav-left" >
        <
        NavLink to = "/"
        end > Home < /NavLink> <
        NavLink to = "/recipes" > Recipes < /NavLink> <
        NavLink to = "/add" > Add Recipe < /NavLink> <
        NavLink to = "/planner" > Planner < /NavLink> <
        NavLink to = "/budget" > Budget < /NavLink> <
        /div>

        <
        div className = "nav-right" > {
            user ? ( <
                >
                <
                span className = "nav-greeting" > Hi, { user.name } < /span> <
                NavLink to = "/profile" > Profile < /NavLink>

                <
                button className = "nav-btn"
                type = "button"
                onClick = { handleLogout } >
                Logout <
                /button> <
                />
            ) : ( <
                >
                <
                NavLink to = "/login" > Login < /NavLink> <
                NavLink to = "/signup" > Sign Up < /NavLink> <
                />
            )
        } <
        /div> <
        /nav>

        <
        /div> <
        /header>

        { /* MAIN CONTENT */ } <
        main className = "main" >
        <
        div className = "main-card" >
        <
        Routes >
        <
        Route path = "/"
        element = { < Home / > }
        /> <
        Route path = "/login"
        element = { < Login / > }
        /> <
        Route path = "/signup"
        element = { < Signup / > }
        /> <
        Route path = "/profile"
        element = { < Profile / > }
        /> <
        Route path = "/recipes"
        element = { < Recipes / > }
        /> <
        Route path = "/recipes/:id"
        element = { < RecipeDetail / > }
        /> <
        Route path = "/add"
        element = { < AddRecipe / > }
        /> <
        Route path = "/planner"
        element = { < Planner / > }
        /> <
        Route path = "/budget"
        element = { < Budget / > }
        /> <
        /Routes> <
        /div> <
        /main>

        <
        /div>
    );
}

export default function App() {
    return ( <
        AuthProvider >
        <
        Layout / >
        <
        /AuthProvider>
    );
}