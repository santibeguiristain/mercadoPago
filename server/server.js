const express = require("express");
const app = express();
const cors = require("cors"); // Evitar problemas de seguridad en navegadores
const path = require("path");
const mercadopago = require("mercadopago");

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
	access_token: "PUBLIC_KEY",
});


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname,"../client"))); // cuando comienza renderiza el archivo.
app.use(cors());


//Cuando se levante una ruta en la direccion raiz, va a levantart el index.html
app.get("/", function (req, res) {
	res.status(200).sendFile("index.html");
});


//Peticion post, que envia una preferencia
app.post("/create_preference", (req, res) => {

	let preference = {
		items: [
			{
				title: req.body.description,
				unit_price: Number(req.body.price),
				quantity: Number(req.body.quantity),
			}
		],
		back_urls: {
			"success": "http://localhost:8080", // Url que indican a donde va a ir luego de que se realice el pago
			"failure": "http://localhost:8080", // Que pasa en caso de que falle el pago
			"pending": ""  // Pago pendiente
		},
		auto_return: "approved",
	};

    //Recive del cliente la preferencia,la crea y devuelve el id.
	mercadopago.preferences
	.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
});

//En caso de que se definan paginas para el success o para el  failure , la misma pagina que se ponga se deveria reemplazar por feedback.
app.get('/feedback', function (req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	});
});


//Escucha el puerto, el que indicamos que sera en donde corre.
app.listen(8080, () => {
	console.log("The server is now running on Port 8080");
});