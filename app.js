const createError = require("http-errors"); // модуль для створення помилок
const express = require("express");
const path = require("path"); // модуль для роботи з шляхами
const cookieParser = require("cookie-parser");
const logger = require("morgan"); // використовується для логування запитів
const fs = require("fs");
const app = express();
require("dotenv").config(); //Завантажує конфігурацію з .env файлу, наприклад секретні ключі чи налаштування.
const cors = require("cors");

// view engine setup

app.use(cors());
app.use(logger("dev")); // використовується для логування http запитів в консолі
app.use(express.json()); // автоматично парсить дані з сервера
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("view engine", "jade");

app.use(express.static(path.join(__dirname, "public")));

// статичні файли із папки  'upload'
app.use("/uploads", express.static("uploads"));

app.use("/api", require("./routes"));

if (!fs.existsSync("uploads")) {
  // уомва перевірки папки сама умова синхронна
  fs.mkdirSync("uploads");
}
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
  res.render("error");
});

module.exports = app;
