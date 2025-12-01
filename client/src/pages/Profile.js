import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setName(user.name);
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  async function handleSave(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Could not update profile.");
        return;
      }
      login(data);
      setMessage("Profile updated.");
    } catch (err) {
      console.error(err);
      setMessage("Network error.");
    }
  }

  return (
    <div className="form-page">
      <h1>Your Profile</h1>
      <form className="form-card" onSubmit={handleSave}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Email
          <input value={user.email} disabled />
        </label>

        {message && <p className="form-message">{message}</p>}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
