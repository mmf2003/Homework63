import { Router } from "express";

import {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/usersController.js";

import { basicAuth } from "../middleware/basicAuth.js";

import { validateUser, validateUserId } from "../middleware/validateUser.js";

const router = Router();

// Public HTML pages.
router.get("/", getUsers);
router.get("/:userId", validateUserId, getUserById);

// Protected modification routes.
router.post("/", basicAuth, validateUser, createUser);

router.put("/:userId", basicAuth, validateUserId, validateUser, updateUser);

router.delete("/:userId", basicAuth, validateUserId, deleteUser);

export default router;
