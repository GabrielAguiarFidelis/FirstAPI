import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usuariosRoutes from "./src/routes/usuarios.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // ✅ TEM QUE VIR ANTES DAS ROTAS
app.use(express.urlencoded({ extended: true }))

app.use("/login", authRoutes);
app.use("/usuarios", usuariosRoutes);

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Monetra API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(130deg, #080e2f 0%, #140f96 100%);
          color: white;
          height: 100vh;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .container {
          background: rgba(255,255,255,0.1);
          padding: 50px 40px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 {
          font-size: 3.5rem;
          margin: 0 0 20px 0;
        }
        p {
          font-size: 1.4rem;
          margin: 10px 0 30px 0;
          opacity: 0.9;
        }
        .status {
          display: inline-block;
          background: #4ade80;
          color: #1e3a8a;
          padding: 12px 30px;
          border-radius: 50px;
          font-weight: bold;
          font-size: 1.2rem;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .rocket { font-size: 4rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="rocket">🚀</div>
        <h1>Monetra API</h1>
        <p>Está rodando perfeitamente!</p>
        <div class="status">✅ ONLINE</div>
        <p style="margin-top: 40px; font-size: 1rem; opacity: 0.7;">
          API pronta para receber requisições
        </p>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
