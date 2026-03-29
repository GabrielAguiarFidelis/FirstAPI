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

  const emailFormatado = email.trim().toLowerCase();

  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", emailFormatado)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(password, data.password);

    if (!senhaValida) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: data.id, email: data.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    delete data.password;

    return res.json({
      message: "Login realizado com sucesso",
      user: data,
      token,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;