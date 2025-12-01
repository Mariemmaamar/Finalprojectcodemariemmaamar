import React, { useEffect, useState } from "react";
import "./Planner.css";

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

export default function Planner() {
    const [recipes, setRecipes] = useState([]);
    const [plan, setPlan] = useState({});
    const [message, setMessage] = useState("");

    // Load recipes + existing planner
    useEffect(() => {
        // load recipes
        fetch("http://localhost:5000/api/recipes")
            .then((res) => res.json())
            .then(setRecipes)
            .catch((err) => console.error("Error loading recipes:", err));

        // load saved plan
        fetch("http://localhost:5000/api/planner")
            .then((res) => res.json())
            .then((data) => setPlan(data.days || {}))
            .catch((err) => console.error("Error loading planner:", err));
    }, []);

    function handleSelect(day, recipeId) {
        setPlan((prev) => ({
            ...prev,
            [day]: recipeId
        }));
        setMessage("");
    }

    async function handleSave() {
        setMessage("");
        try {
            const res = await fetch("http://localhost:5000/api/planner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ days: plan })
            });

            if (!res.ok) {
                setMessage("Error saving meal plan.");
                return;
            }

            setMessage("Meal plan saved successfully!");
        } catch (err) {
            console.error(err);
            setMessage("Network error while saving.");
        }
    }

    return ( <
        div className = "planner-container" >
        <
        h1 className = "planner-title" > Weekly Meal Planner < /h1>

        <
        div className = "planner-grid" > {
            DAYS.map((day) => ( <
                div key = { day }
                className = "planner-card" >
                <
                h3 > { day } < /h3> <
                select value = { plan[day] || "" }
                onChange = {
                    (e) => handleSelect(day, e.target.value) } >
                <
                option value = "" > No recipe < /option> {
                    recipes.map((recipe) => ( <
                        option key = { recipe.id }
                        value = { recipe.id } > { recipe.name } <
                        /option>
                    ))
                } <
                /select> <
                /div>
            ))
        } <
        /div>

        <
        button className = "planner-save-btn"
        type = "button"
        onClick = { handleSave } >
        Save Plan <
        /button>

        {
            message && < p className = "planner-message" > { message } < /p>} <
                /div>
        );
    }