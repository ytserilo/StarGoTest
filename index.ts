import express, { Application, Request, Response } from 'express'
import next from "next";

const nextServer = next({dev: true});
const nextHandler = nextServer.getRequestHandler();

(async () => {
    try {
        await nextServer.prepare();
        const app: Application = express();

        app.use(express.json());

        app.get("*", (req: Request, res: Response) => {
            return nextHandler(req, res);
        });

        let port = process.env.PORT || 3000;
        app.listen(port);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();

