export function validateUser(req, res, next) {
    const { username, password } = req.body ?? {};

    if (
        typeof username !== "string" ||
        !username.trim() ||
        typeof password !== "string" ||
        !password.trim()
    ) {
        return res
            .status(400)
            .type("text")
            .send("Missing required fields: username and password");
    }

    next();
}

export function validateUserId(req, res, next) {
    const { userId } = req.params;

    if (!/^[1-9]\d*$/.test(userId)) {
        return res.status(400).type("text").send("Invalid user ID");
    }

    next();
}
