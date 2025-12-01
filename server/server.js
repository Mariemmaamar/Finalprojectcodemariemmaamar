const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Paths
const dataDir = path.join(__dirname, "data");
const usersPath = path.join(dataDir, "users.json");
const recipesPath = path.join(dataDir, "recipes.json");
const plannerPath = path.join(dataDir, "planner.json");
const budgetPath = path.join(dataDir, "budget.json");

// Ensure data folder exists
function ensureDir() {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Safe load
function loadJSON(file, fallback) {
    try {
        if (!fs.existsSync(file)) return fallback;
        const raw = fs.readFileSync(file, "utf-8");
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (err) {
        console.error("Error loading JSON:", file, err);
        return fallback;
    }
}

// Safe save
function saveJSON(file, data) {
    try {
        ensureDir();
        fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
        console.error("Error saving JSON:", file, err);
    }
}

/* ===========================================
   ============ AUTH & USERS =================
   =========================================== */

app.post("/api/auth/register", (req, res) => {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const users = loadJSON(usersPath, []);
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
        return res.status(409).json({ message: "An account with that email already exists." });
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password
    };

    users.push(newUser);
    saveJSON(usersPath, users);

    res.status(201).json({ id: newUser.id, name, email });
});

app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const users = loadJSON(usersPath, []);
    const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) return res.status(401).json({ message: "Invalid email or password." });

    res.json({ id: user.id, name: user.name, email: user.email });
});

/* ===========================================
   ============ RECIPES =======================
   =========================================== */

app.get("/api/recipes", (req, res) => {
    const recipes = loadJSON(recipesPath, []);
    res.json(recipes);
});

app.post("/api/recipes", (req, res) => {
    const { name, ingredients, steps, cost, image } = req.body || {};

    if (!name || !ingredients || !steps || !cost || !image) {
        return res.status(400).json({
            message: "Name, ingredients, steps, cost, and image URL are required."
        });
    }

    const recipes = loadJSON(recipesPath, []);

    const newRecipe = {
        id: Date.now().toString(),
        name,
        ingredients,
        steps,
        cost: Number(cost),
        image
    };

    recipes.push(newRecipe);
    saveJSON(recipesPath, recipes);

    res.status(201).json(newRecipe);
});

/* ===========================================
   ============ MEAL PLANNER ==================
   =========================================== */

app.get("/api/planner", (req, res) => {
    const planner = loadJSON(plannerPath, { days: {} });
    res.json(planner);
});

app.post("/api/planner", (req, res) => {
    const { days } = req.body || {};
    const planner = { days: typeof days === "object" ? days : {} };

    saveJSON(plannerPath, planner);
    res.json(planner);
});

/* Calculate total planner cost */
app.get("/api/planner/cost", (req, res) => {
    const planner = loadJSON(plannerPath, { days: {} });
    const recipes = loadJSON(recipesPath, []);

    let totalCost = 0;

    for (const day in planner.days) {
        const meals = planner.days[day];

        meals.forEach(recipeId => {
            const recipe = recipes.find(r => r.id == recipeId);
            if (recipe) {
                totalCost += Number(recipe.cost) || 0;
            }
        });
    }

    res.json({ totalCost });
});
/* ===========================================
   ============ PLANNER TOTAL COST ============
   =========================================== */

app.get("/api/planner/cost", (req, res) => {
    const planner = loadJSON(plannerPath, { days: {} });
    const recipes = loadJSON(recipesPath, []);

    let totalCost = 0;

    for (const day in planner.days) {
        const meals = planner.days[day];

        meals.forEach((id) => {
            const recipe = recipes.find(r => r.id == id);
            if (recipe) {
                totalCost += Number(recipe.cost);
            }
        });
    }

    res.json({ totalCost });
});


/* ===========================================
   ============ BUDGET (SMART AUTO COST) =====
   =========================================== */

function calculatePlannerCost() {
    const planner = loadJSON(plannerPath, { days: {} });
    const recipes = loadJSON(recipesPath, []);

    let total = 0;

    for (const day in planner.days) {
        const meals = planner.days[day];

        meals.forEach((id) => {
            const recipe = recipes.find(r => r.id == id);
            if (recipe) {
                total += Number(recipe.cost) || 0;
            }
        });
    }

    return total;
}

app.get("/api/budget", (req, res) => {
    const saved = loadJSON(budgetPath, { weeklyBudget: 0, manualCost: 0 });

    const plannerCost = calculatePlannerCost();

    res.json({
        weeklyBudget: Number(saved.weeklyBudget) || 0,
        manualCost: Number(saved.manualCost) || 0,
        plannerCost,
        totalEstimatedCost: plannerCost + (Number(saved.manualCost) || 0)
    });
});

app.post("/api/budget", (req, res) => {
    const { weeklyBudget, manualCost } = req.body;

    const toSave = {
        weeklyBudget: Number(weeklyBudget) || 0,
        manualCost: Number(manualCost) || 0
    };

    saveJSON(budgetPath, toSave);

    res.json({
        ...toSave,
        plannerCost: calculatePlannerCost(),
        totalEstimatedCost: calculatePlannerCost() + toSave.manualCost
    });
});


/* ===========================================
   ============ START SERVER ==================
   =========================================== */

const PORT = 5000;
app.listen(PORT, () => {
    console.log("NutriTrack backend running on port " + PORT);
});