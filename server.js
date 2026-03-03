require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// Middlewares para compatibilidad total
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Sirve tu HTML desde la carpeta public

// Configuración con variables de entorno para seguridad
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
    // 1. Correo para el Administrador (Tú)
    await transporter.sendMail({
      from: `"Sistema" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Nuevo incidente: ${asunto}`,
      html: `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${mensaje}</p>
      `
    });

    // 2. PROGRAMA DE RESPUESTA (Confirmación para el usuario)
    await transporter.sendMail({
      from: `"Soporte" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Hemos recibido tu reporte",
      html: `<p>Hola ${nombre}, hemos recibido tu reporte correctamente. Nuestro equipo lo revisará pronto.</p>`
    });

    res.json({ mensaje: "Reporte enviado correctamente ✅" });

  } catch (error) {
    console.error("Error detallado:", error);
    res.status(500).json({ error: "Error al enviar el correo ❌" });
  }
});

// PUERTO DINÁMICO para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});