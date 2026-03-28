import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usuariosRoutes from "./src/routes/usuarios.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // ✅ TEM QUE VIR ANTES DAS ROTAS

app.use("/usuarios", usuariosRoutes);
app.use("/", authRoutes);

app.get("/", (req, res) => {
  req.body; // ✅ para testar se o JSON está sendo lido
  res.send("API Monetra rodando 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
