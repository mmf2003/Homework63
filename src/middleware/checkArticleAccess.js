import { basicAuth } from "./basicAuth.js";

export function checkArticleAccess(req, res, next) {
    // First authenticate the requester.
    basicAuth(req, res, () => {
        // Any authenticated user can read articles.
        if (req.method === "GET") {
            return next();
        }

        // Only admins can create, update or delete articles.
        if (req.user.role !== "admin") {
            return res
                .status(403)
                .type("text")
                .send("Access denied. Admin role required.");
        }

        next();
    });
}

export function validateArticleId(req, res, next) {
    if (!/^[1-9]\d*$/.test(req.params.articleId)) {
        return res.status(400).type("text").send("Invalid article ID");
    }

    next();
}
