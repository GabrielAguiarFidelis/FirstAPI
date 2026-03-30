import express from "express";
import { supabase } from "../config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email);

    const user = data[0];

    if (error || !user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const senhaHash = await bcrypt.hash(password, 10)
    const senhaValida = await bcrypt.compare(password, user.password);

    if (!senhaHash || !senhaValida) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    delete user.password;

    return res.json({
      message: "Login realizado com sucesso",
      user: user,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
