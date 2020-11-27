const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const app = express();
const lstProductsV1 = require("./files/productsv1.json");
const lstProductsV2 = require("./files/productsv2.json");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

let respuesta = {
  error: false,
  code: 0,
  message: "",
  products: {},
};

app.get("/", function (req, res) {
  respuesta.error = false;
  respuesta.code = 200;
  respuesta.message = "Status request";
  respuesta.products = {};
  res.send(respuesta);
});

app.get("/getProducts/v1", function (req, res) {
  respuesta.error = false;
  respuesta.code = 200;
  respuesta.message = "List Of Products";
  respuesta.products = lstProductsV1;
  res.send(respuesta);
});

app.get("/getProducts/v2", function (req, res) {
  respuesta.error = false;
  respuesta.code = 200;
  respuesta.message = "List Of Products";
  respuesta.products = lstProductsV2;
  res.send(respuesta);
});

app.use(function (req, res, next) {
  respuesta.error = true;
  respuesta.code = 404;
  respuesta.message = "URL not found";
  respuesta.products = {};
  res.status(404).send(respuesta);
});

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
