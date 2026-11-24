import { articles } from "../data/articles.js";

export const getArticles = (req, res) => {
    res.render("ejs/articles.ejs", {
        title: "Articles",
        articles,
    });
};

export const createArticle = (req, res) => {
    res.type("text").send("Post articles route");
};

export const getArticleById = (req, res) => {
    const article = articles.find(
        (item) => item.id === Number(req.params.articleId),
    );

    if (!article) {
        return res.status(404).type("text").send("Article not found");
    }

    res.render("ejs/article.ejs", {
        title: "Article Details",
        article,
    });
};

export const updateArticle = (req, res) => {
    res.type("text").send(`Put article by Id route: ${req.params.articleId}`);
};

export const deleteArticle = (req, res) => {
    res.type("text").send(
        `Delete article by Id route: ${req.params.articleId}`,
    );
};
