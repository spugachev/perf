import { Router, Request, Response } from "express";
import expressGraphQL from "express-graphql";
import { schema } from "../schema";

const apiRouter = Router();

const isDev = process.env.NODE_ENV === "development";

apiRouter.use("/graphql", (req: Request, res: Response) => {
  expressGraphQL({
    schema: schema,
    graphiql: isDev,
    context: { req, res },
  })(req, res);
});

export { apiRouter };
