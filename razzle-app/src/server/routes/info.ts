import express, { Router } from "express";

const router = Router();

router.get("/live", (req: express.Request, res: express.Response) => {
  res.sendStatus(200);
});

export default router;
