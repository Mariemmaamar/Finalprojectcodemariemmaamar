import React, { useEffect, useState } from "react";
import "./Recipes.css";

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/recipes")
            .then((res) => res.json())
            .then(setRecipes)
            .catch((err) => console.error("Error loading recipes", err));
    }, []);

    return ( <
        div className = "pinterest-page" >
        <
        h1 className = "pinterest-title" > Explore Recipes < /h1> <
        div className = "pinterest-grid" > {
            recipes.map((recipe) => ( <
                div key = { recipe.id }
                className = "pin-card fade-in" > {
                    recipe.image && ( <
                        img src = { recipe.image }
                        alt = { recipe.name }
                        className = "pin-image" / >
                    )
                } <
                div className = "pin-content" >
                <
                h2 className = "pin-name" > { recipe.name } < /h2> <
                p className = "pin-cost" > $ { Number(recipe.cost).toFixed(2) } < /p> <
                p className = "pin-text" >
                <
                strong > Ingredients: < /strong> {recipe.ingredients} < /
                p > {
                    recipe.steps && ( <
                        p className = "pin-text" >
                        <
                        strong > Steps: < /strong> {recipe.steps} < /
                        p >
                    )
                } <
                /div> < /
                div >
            ))
        } <
        /div> < /
        div >
    );
}