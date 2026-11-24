export function notFoundHandler(req, res) {
    res.status(404).type("text").send("Route not found");
}

export function errorHandler(err, req, res, next) {
    console.error("Server error:", err);

    if (res.headersSent) {
        return next(err);
    }

    // Handle invalid JSON request bodies.
    if (err.type === "entity.parse.failed") {
        return res.status(400).type("text").send("Invalid JSON");
    }

    res.status(500).type("text").send("Internal Server Error");
}
