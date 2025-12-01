import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) setMessage(data.message);
        else setRecipe(data);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Could not load recipe.");
      });
  }, [id]);

  if (message && !recipe) {
    return (
      <div className="form-page">
        <div className="form-card">
          <p>{message}</p>
          <button onClick={() => navigate("/recipes")}>Back to Recipes</button>
        </div>
      </div>
    );
  }

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="form-page">
      <h1>{recipe.name}</h1>
      <div className="form-card">
        <p>
          <strong>Estimated Cost:</strong>{" "}
          {recipe.cost !== undefined ? `$${Number(recipe.cost).toFixed(2)}` : "N/A"}
        </p>
        <h3>Ingredients</h3>
        <p>{recipe.ingredients}</p>
        <h3>Steps</h3>
        <p>{recipe.steps}</p>
        <button type="button" onClick={() => navigate("/recipes")}>
          Back to Recipes
        </button>
      </div>
    </div>
  );
}
