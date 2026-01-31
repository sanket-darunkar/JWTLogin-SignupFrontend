import { useEffect, useState } from "react";
import api from '../api/api.js';

function Profile() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        api.get("/profile")
        .then((res) => setMessage("Hello Welcome to your profile page!"))
        .catch((err) => setMessage("Failed to fetch profile data."));
    }, []);

    return (
        <div>
            <h2>Profile</h2>
            <p>{message}</p>
        </div>
    );
}

export default Profile;