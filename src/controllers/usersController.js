import { users } from "../data/users.js";

export const getUsers = (req, res) => {
    res.render("pug/users.pug", {
        title: "Users",
        users,
    });
};

export const createUser = (req, res) => {
    res.type("text").send("Post users route");
};

export const getUserById = (req, res) => {
    const user = users.find((item) => item.id === Number(req.params.userId));

    if (!user) {
        return res.status(404).type("text").send("User not found");
    }

    res.render("pug/user.pug", {
        title: "User Profile",
        user,
    });
};

export const updateUser = (req, res) => {
    res.type("text").send(`Put user by Id route: ${req.params.userId}`);
};

export const deleteUser = (req, res) => {
    res.type("text").send(`Delete user by Id route: ${req.params.userId}`);
};
