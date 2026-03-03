require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/enviar-reporte", async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;
  try {
    // 1. Reporte para ti
    await transporter.sendMail({
      from: `"Sistema" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Nuevo incidente: ${asunto}`,
      html: `<p><strong>Nombre:</strong> ${nombre}</p><p><strong>Email:</strong> ${email}</p><p>${mensaje}</p>`
    });

    // 2. Respuesta automática para el usuario
    await transporter.sendMail({
      from: `"Soporte" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Recibimos tu reporte",
      html: `<p>Hola ${nombre}, hemos recibido tu mensaje correctamente.</p>`
    });

    res.json({ mensaje: "Reporte enviado con éxito ✅" });
  } catch (error) {
    res.status(500).json({ error: "Error al enviar ❌" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Puerto: ${PORT}`));