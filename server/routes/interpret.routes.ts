import express from "express";
import { interpret, simpleCall, generateImageController } from "../controllers/interpret.controller.ts";

const router = express.Router();

router.post("/", interpret);
router.post("/simple", simpleCall);
router.post("/image", generateImageController);

export default router;
