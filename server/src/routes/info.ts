import { Router, Request, Response } from "express";

const infoRouter = Router();

infoRouter.get("/live", (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { infoRouter };
