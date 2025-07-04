import Logger from "./core/Logger";
import { port } from "./config";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

app
  .listen(port, () => {
    Logger.info(`Server is running on port ${port}`);
  })
  .on("error", (e) => Logger.error(e));
