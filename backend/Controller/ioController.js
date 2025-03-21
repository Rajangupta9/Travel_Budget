const { getIO } = require("../Config/socketServer");

// Example user data
const users = [];

const getAllUsers = (req, res) => {
    res.json({ success: true, users });

    // Emit user list update event
    getIO().emit("userListUpdated", users);
};

const addUser = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: "Name is required" });
    }

    const newUser = { id: users.length + 1, name };
    users.push(newUser);

    res.status(201).json({ success: true, user: newUser });

    // Emit event to notify all clients
    getIO().emit("userAdded", newUser);
};

module.exports = { getAllUsers, addUser };
