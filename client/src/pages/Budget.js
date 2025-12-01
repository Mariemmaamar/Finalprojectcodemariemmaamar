import React, { useEffect, useState } from "react";
import "./Budget.css";

export default function Budget() {
    const [weeklyBudget, setWeeklyBudget] = useState("0");
    const [manualCost, setManualCost] = useState("0");
    const [status, setStatus] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/budget")
            .then((res) => res.json())
            .then((data) => {
                setWeeklyBudget(String(data.weeklyBudget || "0"));
                setManualCost(String(data.manualCost || "0"));
            });

        // 🟢 SMART: Automatically update cost from planner
        fetch("http://localhost:5000/api/planner/cost")
            .then((res) => res.json())
            .then((data) => {
                setManualCost(String(data.totalCost || "0"));
            });
    }, []);

    async function handleSave() {
        setStatus("");

        try {
            const res = await fetch("http://localhost:5000/api/budget", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    weeklyBudget: Number(weeklyBudget),
                    manualCost: Number(manualCost),
                }),
            });

            if (!res.ok) return setStatus("❌ Error saving budget.");
            setStatus("✔ Budget saved!");
        } catch {
            setStatus("❌ Network error.");
        }
    }

    const weeklyNum = Number(weeklyBudget) || 0;
    const manualNum = Number(manualCost) || 0;

    const usedPercent =
        weeklyNum > 0 ? Math.min((manualNum / weeklyNum) * 100, 100) : 0;

    let barClass = "budget-safe-fill";
    if (usedPercent > 70 && usedPercent < 100) barClass = "budget-warning-fill";
    if (usedPercent >= 100) barClass = "budget-danger-fill";

    function handleNumericInput(e, setter) {
        let val = e.target.value;
        const isSpinner =
            e.nativeEvent.inputType === "increment" ||
            e.nativeEvent.inputType === "decrement";

        val = val.replace(/[^0-9.]/g, "");
        const parts = val.split(".");
        if (parts.length > 2) {
            val = parts[0] + "." + parts[1];
        }

        if (!isSpinner && val.startsWith("0") && !val.startsWith("0.") && val.length > 1) {
            val = val.replace(/^0+/, "");
            if (val === "") val = "0";
        }

        if (val === "") val = "0";
        setter(val);
    }

    return ( <
        div className = "budget-container fade-in-budget" >
        <
        h1 className = "budget-title" > Budget Tracker < /h1>

        <
        div className = "budget-section" >
        <
        h2 className = "budget-subtitle" > Set Weekly Budget < /h2>

        <
        label className = "budget-label" > Weekly Budget($) < /label> <
        input type = "number"
        step = "0.01"
        className = "budget-input"
        value = { weeklyBudget }
        onChange = {
            (e) => handleNumericInput(e, setWeeklyBudget)
        }
        />

        <
        label className = "budget-label"
        style = {
            { marginTop: "20px" }
        } >
        Estimated Total Cost($) <
        /label> <
        input type = "number"
        step = "0.01"
        className = "budget-input"
        value = { manualCost }
        onChange = {
            (e) => handleNumericInput(e, setManualCost)
        }
        />

        <
        button className = "budget-btn"
        onClick = { handleSave } >
        Save Budget <
        /button>

        {
            status && < p className = "budget-status-msg" > { status } < /p>} < /
                div >

                <
                div className = "budget-section"
            style = {
                    { marginTop: "50px" }
                } >
                <
                h2 className = "budget-subtitle" > Plan Cost Overview < /h2>

            <
            p className = "budget-text" >
                Estimated total cost: < strong > $ { manualNum.toFixed(2) } < /strong> < /
                p >

                <
                div className = "budget-bar-wrap" >
                <
                div
            className = { `budget-bar-fill ${barClass}` }
            style = {
                    { width: `${usedPercent}%` }
                } >
                <
                /div> < /
                div >

                <
                p className = "budget-text" >
                Using < strong > $ { manualNum.toFixed(2) } < /strong> of{" "} <
            strong > $ { weeklyNum } < /strong> < /
                p >

                <
                p className = { manualNum <= weeklyNum ? "budget-safe" : "budget-over" } > {
                    weeklyNum === 0 ?
                    "" : manualNum <= weeklyNum ?
                        "You are within your budget." : "⚠ You are over your budget!"
                } <
                /p> < /
                div > <
                /div>
        );
    }