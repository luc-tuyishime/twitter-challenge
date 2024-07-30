import { Router } from "express";

const router = Router();

router.get("/", (_, res) => res.send("Welcome to twitter recommendation API"));

export default router;
