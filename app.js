const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const artistsRouter = require("./routes/artists");
const albumsRouter = require("./routes/albums");
const actorsRouter = require("./routes/actors");
const moviesRouter = require("./routes/movies");
const songsRouter = require("./routes/songs");
const topicsRouter = require("./routes/topics");
const nodesRouter = require("./routes/nodes");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/artists", artistsRouter);
app.use("/api/albums", albumsRouter);
app.use("/api/songs", songsRouter);
app.use("/api/actors", actorsRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/nodes", nodesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

module.exports = app;
