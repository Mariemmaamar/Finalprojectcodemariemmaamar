import React, { useState } from "react";
import "./AddRecipe.css";

export default function AddRecipe() {
    const [form, setForm] = useState({
        name: "",
        ingredients: "",
        steps: "",
        cost: "",
        image: ""
    });

    const [message, setMessage] = useState("");

    function handleChange(e) {
        setForm({...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");

        if (!form.name || !form.ingredients || !form.steps || !form.cost) {
            setMessage("All fields are required.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/recipes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    ingredients: form.ingredients,
                    steps: form.steps,
                    cost: Number(form.cost),
                    image: form.image || ""
                })
            });

            if (!res.ok) {
                setMessage("Failed to save recipe.");
                return;
            }

            setMessage("Recipe saved successfully!");
            setForm({ name: "", ingredients: "", steps: "", cost: "", image: "" });
        } catch (err) {
            console.error(err);
            setMessage("Network error.");
        }
    }

    return ( <
        div className = "add-container" >
        <
        h1 className = "add-title" > Add a New Recipe < /h1>

        <
        form className = "add-form"
        onSubmit = { handleSubmit } >
        <
        label >
        Recipe Name <
        input name = "name"
        value = { form.name }
        onChange = { handleChange }
        placeholder = "e.g. Creamy Veggie Pasta" /
        >
        <
        /label>

        <
        label >
        Ingredients <
        textarea name = "ingredients"
        value = { form.ingredients }
        onChange = { handleChange }
        placeholder = "List ingredients separated by commas" /
        >
        <
        /label>

        <
        label >
        Steps <
        textarea name = "steps"
        value = { form.steps }
        onChange = { handleChange }
        placeholder = "Describe how to prepare the recipe" /
        >
        <
        /label>

        <
        label >
        Cost($) <
        input type = "number"
        step = "0.01"
        name = "cost"
        value = { form.cost }
        onChange = { handleChange }
        placeholder = "e.g. 4.50" /
        >
        <
        /label>

        <
        label >
        Image URL <
        input name = "image"
        value = { form.image }
        onChange = { handleChange }
        placeholder = "https://example.com/food.jpg" /
        >
        <
        /label>

        {
            message && < p className = "add-message" > { message } < /p>}

            <
            button type = "submit"
            className = "add-btn" > Save Recipe < /button> < /
                form > <
                /div>
        );
    }