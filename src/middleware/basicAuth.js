// Demo credentials for educational use only.
const TOKENS = {
    "user-token": "user",
    "admin-token": "admin",
};

export function basicAuth(req, res, next) {
    const authorization = req.get("authorization");

    if (!authorization) {
        return res
            .status(401)
            .type("text")
            .send("Access denied. No credentials sent.");
    }

    const match = /^Bearer (.+)$/i.exec(authorization);
    const role = match ? TOKENS[match[1]] : undefined;

    if (!role) {
        return res
            .status(401)
            .type("text")
            .send("Invalid authentication token");
    }

    req.user = { role };

    next();
}
