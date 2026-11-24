import { randomUUID } from "node:crypto";

const sessions = new Map();

export function sessionMiddleware(req, res, next) {
    const cookies = Object.fromEntries(
        (req.headers.cookie ?? "")
            .split(";")
            .map((cookie) => cookie.trim())
            .filter(Boolean)
            .map((cookie) => {
                const index = cookie.indexOf("=");

                return [cookie.slice(0, index), cookie.slice(index + 1)];
            }),
    );

    let sessionId = cookies.sessionId;
    let session = sessions.get(sessionId);

    if (!session) {
        sessionId = randomUUID();

        session = {
            createdAt: Date.now(),
            requestCount: 0,
        };

        sessions.set(sessionId, session);

        res.setHeader(
            "Set-Cookie",
            `sessionId=${sessionId}; HttpOnly; SameSite=Lax; Path=/`,
        );
    }

    session.requestCount += 1;

    req.session = session;

    next();
}
