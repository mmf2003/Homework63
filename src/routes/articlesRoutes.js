import { Router } from "express";

import {
    getArticles,
    createArticle,
    getArticleById,
    updateArticle,
    deleteArticle,
} from "../controllers/articlesController.js";

import {
    checkArticleAccess,
    validateArticleId,
} from "../middleware/checkArticleAccess.js";

const router = Router();

// Public HTML pages.
router.get("/", getArticles);
router.get("/:articleId", validateArticleId, getArticleById);

// Protected modification routes.
router.post("/", checkArticleAccess, createArticle);

router.put("/:articleId", checkArticleAccess, validateArticleId, updateArticle);

router.delete(
    "/:articleId",
    checkArticleAccess,
    validateArticleId,
    deleteArticle,
);

export default router;
