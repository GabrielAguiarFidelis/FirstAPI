import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usuariosRoutes from "./src/routes/usuarios.js";
import authRoutes from "./src/routes/authRoutes.js";
import Stripe from "stripe";

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json()); // ✅ TEM QUE VIR ANTES DAS ROTAS
app.use(express.urlencoded({ extended: true }))

app.use("/login", authRoutes);
app.use("/usuarios", usuariosRoutes);

// ====================== CRIA CHECKOUT SESSION ======================
app.post("/create-checkout-session", async (req, res) => {
  const { email, plano } = req.body;

  if (!email || !plano) {
    return res.status(400).json({ error: "Email e plano são obrigatórios" });
  }

  // Mapeamento dos Price IDs (substitua pelos seus reais)
  const priceMap = {
    "PRO": "price_1THTnvJPuLtnJsg33YEa1g29",       // ← cole o Price ID do PRO
    "PREMIUM": "price_1THTquJPuLtnJsg3wNzM5bpb" // ← cole o Price ID do PREMIUM
  };

  const priceId = priceMap[plano.toUpperCase()];

  if (!priceId) {
    return res.status(400).json({ error: "Plano inválido para pagamento" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",           // importante: é assinatura recorrente
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}&plano=${plano}`,
      cancel_url: `${req.headers.origin}/index.html`,   // volta para a página de login/cadastro
      metadata: {
        email: email,
        plano: plano
      }
    });

    res.json({ url: session.url });   // retorna a URL do Checkout do Stripe
  } catch (error) {
    console.error("Erro Stripe:", error);
    res.status(500).json({ error: "Erro ao criar sessão de pagamento" });
  }
});

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
