import express from "express";
import bodyParser from "body-parser";
import createError from "http-errors";
import helmet from "helmet";
import routes from "./routes/index.js";
import {
  HTTP_NOT_FOUND,
  HTTP_SERVER_ERROR,
} from "./constants/httpStatusCodes.js";

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 4000;

app.use("/api/v1", routes);

app.use((_, __, next) => {
  next(createError(HTTP_NOT_FOUND));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || HTTP_SERVER_ERROR);
  res.send({ message: err.message, status: err.status, error: err });
  next();
});

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

export default app;
