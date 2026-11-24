import test from "node:test";
import assert from "node:assert/strict";

import app from "./src/app.js";

const server = app.listen(0);
const address = server.address();
const BASE_URL = `http://127.0.0.1:${address.port}`;

const USER_TOKEN = "Bearer user-token";
const ADMIN_TOKEN = "Bearer admin-token";

test.after(() => {
    server.close();
});

// Helper for making HTTP requests.
async function request(path, options = {}) {
    return fetch(`${BASE_URL}${path}`, options);
}

test("Homework62 - Express, PUG and EJS", async (t) => {
    // =====================================
    // ROOT ROUTE
    // =====================================

    await t.test("GET / returns 200", async () => {
        const response = await request("/");

        assert.equal(response.status, 200);
        assert.match(await response.text(), /Get root route/);
    });

    // =====================================
    // PUG - USERS
    // =====================================

    await t.test("GET /users returns 200", async () => {
        const response = await request("/users");

        assert.equal(response.status, 200);
    });

    await t.test("GET /users returns HTML", async () => {
        const response = await request("/users");

        assert.match(response.headers.get("content-type"), /text\/html/);
    });

    await t.test("PUG users page contains HTML structure", async () => {
        const response = await request("/users");
        const html = await response.text();

        assert.match(html, /<!DOCTYPE html>/i);
        assert.match(html, /<html/i);
        assert.match(html, /<body/i);
        assert.match(html, /<table/i);
    });

    await t.test("PUG users page displays user data", async () => {
        const response = await request("/users");
        const html = await response.text();

        assert.match(html, /Alex Johnson/);
        assert.match(html, /Emma Wilson/);
        assert.match(html, /alex@example\.com/);
    });

    await t.test("PUG users page contains profile links", async () => {
        const response = await request("/users");
        const html = await response.text();

        assert.match(html, /href="\/users\/1"/);
        assert.match(html, /href="\/users\/2"/);
    });

    await t.test("GET /users/1 returns profile", async () => {
        const response = await request("/users/1");
        const html = await response.text();

        assert.equal(response.status, 200);
        assert.match(html, /Alex Johnson/);
        assert.match(html, /alex@example\.com/);
    });

    await t.test("GET /users/2 returns another profile", async () => {
        const response = await request("/users/2");
        const html = await response.text();

        assert.equal(response.status, 200);
        assert.match(html, /Emma Wilson/);
    });

    await t.test("Unknown user returns 404", async () => {
        const response = await request("/users/9999");

        assert.equal(response.status, 404);
        assert.match(await response.text(), /User not found/);
    });

    // =====================================
    // EJS - ARTICLES
    // =====================================

    await t.test("GET /articles returns 200", async () => {
        const response = await request("/articles");

        assert.equal(response.status, 200);
    });

    await t.test("GET /articles returns HTML", async () => {
        const response = await request("/articles");

        assert.match(response.headers.get("content-type"), /text\/html/);
    });

    await t.test("EJS articles page displays article data", async () => {
        const response = await request("/articles");
        const html = await response.text();

        assert.match(html, /Getting Started with Node\.js/);
        assert.match(html, /Understanding Express\.js/);
    });

    await t.test("EJS articles page contains article links", async () => {
        const response = await request("/articles");
        const html = await response.text();

        assert.match(html, /href="\/articles\/1"/);
        assert.match(html, /href="\/articles\/2"/);
    });

    await t.test("GET /articles/1 returns article details", async () => {
        const response = await request("/articles/1");
        const html = await response.text();

        assert.equal(response.status, 200);
        assert.match(html, /Getting Started with Node\.js/);
        assert.match(html, /Node\.js allows developers/);
    });

    await t.test("GET /articles/2 returns another article", async () => {
        const response = await request("/articles/2");
        const html = await response.text();

        assert.equal(response.status, 200);
        assert.match(html, /Understanding Express\.js/);
    });

    await t.test("Unknown article returns 404", async () => {
        const response = await request("/articles/9999");

        assert.equal(response.status, 404);
        assert.match(await response.text(), /Article not found/);
    });

    // =====================================
    // CSS
    // =====================================

    await t.test("CSS file is accessible", async () => {
        const response = await request("/css/style.css");

        assert.equal(response.status, 200);
        assert.match(response.headers.get("content-type"), /text\/css/);
    });

    await t.test("CSS contains dashboard styles", async () => {
        const response = await request("/css/style.css");
        const css = await response.text();

        assert.match(css, /\.header/);
        assert.match(css, /\.users-table/);
        assert.match(css, /\.article-card/);
    });

    await t.test("HTML pages include CSS link", async () => {
        for (const path of ["/users", "/users/1", "/articles", "/articles/1"]) {
            const response = await request(path);
            const html = await response.text();

            assert.match(html, /\/css\/style\.css/);
        }
    });

    // =====================================
    // AUTHENTICATION
    // =====================================

    await t.test("POST /users without token returns 401", async () => {
        const response = await request("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: "Alex",
                password: "123456",
            }),
        });

        assert.equal(response.status, 401);
    });

    await t.test("POST /users with token returns 200", async () => {
        const response = await request("/users", {
            method: "POST",
            headers: {
                Authorization: USER_TOKEN,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: "Alex",
                password: "123456",
            }),
        });

        assert.equal(response.status, 200);
        assert.match(await response.text(), /Post users route/);
    });

    await t.test("POST /users validates required fields", async () => {
        const response = await request("/users", {
            method: "POST",
            headers: {
                Authorization: USER_TOKEN,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });

        assert.equal(response.status, 400);
        assert.match(await response.text(), /Missing required fields/);
    });

    await t.test("DELETE /users/1 requires authentication", async () => {
        const response = await request("/users/1", {
            method: "DELETE",
        });

        assert.equal(response.status, 401);
    });

    // =====================================
    // ARTICLE AUTHORIZATION
    // =====================================

    await t.test("POST /articles with user token returns 403", async () => {
        const response = await request("/articles", {
            method: "POST",
            headers: {
                Authorization: USER_TOKEN,
            },
        });

        assert.equal(response.status, 403);
    });

    await t.test("POST /articles with admin token returns 200", async () => {
        const response = await request("/articles", {
            method: "POST",
            headers: {
                Authorization: ADMIN_TOKEN,
            },
        });

        assert.equal(response.status, 200);
        assert.match(await response.text(), /Post articles route/);
    });

    await t.test("PUT /articles/1 with user token returns 403", async () => {
        const response = await request("/articles/1", {
            method: "PUT",
            headers: {
                Authorization: USER_TOKEN,
            },
        });

        assert.equal(response.status, 403);
    });

    await t.test(
        "DELETE /articles/1 with admin token returns 200",
        async () => {
            const response = await request("/articles/1", {
                method: "DELETE",
                headers: {
                    Authorization: ADMIN_TOKEN,
                },
            });

            assert.equal(response.status, 200);
            assert.match(
                await response.text(),
                /Delete article by Id route: 1/,
            );
        },
    );

    // =====================================
    // ERROR HANDLING
    // =====================================

    await t.test("Unknown route returns 404", async () => {
        const response = await request("/unknown");

        assert.equal(response.status, 404);
    });

    await t.test("Invalid user ID returns 400", async () => {
        const response = await request("/users/abc");

        assert.equal(response.status, 400);
    });

    await t.test("Invalid article ID returns 400", async () => {
        const response = await request("/articles/abc");

        assert.equal(response.status, 400);
    });

    // =====================================
    // SESSIONS
    // =====================================

    await t.test("Server creates a session cookie", async () => {
        const response = await request("/");

        const cookie = response.headers.get("set-cookie");

        assert.ok(cookie);
        assert.match(cookie, /sessionId=/);
    });

    await t.test("Existing session does not create a new cookie", async () => {
        const firstResponse = await request("/");

        const cookie = firstResponse.headers.get("set-cookie").split(";")[0];

        const secondResponse = await request("/", {
            headers: {
                Cookie: cookie,
            },
        });

        assert.equal(secondResponse.status, 200);
        assert.equal(secondResponse.headers.get("set-cookie"), null);
    });
});
