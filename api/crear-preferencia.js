
const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const productos = req.body;

    const items = productos.map((producto) => ({
      title: producto.nombre,
      unit_price: Number(producto.precio),
      quantity: producto.cantidad
    }));

    const preference = {
      items,
      back_urls: {
        success: "https://meelcosmeticosuy.com/success",
        failure: "https://meelcosmeticosuy.com/failure",
        pending: "https://meelcosmeticosuy.com/pending"
      },
      auto_return: "approved"
    };

    const response = await mercadopago.preferences.create(preference);
    res.status(200).json({ id: response.body.id });
  } catch (error) {
    console.error("Error al crear preferencia:", error);
    res.status(500).json({ error: "Error al crear preferencia" });
  }
}
