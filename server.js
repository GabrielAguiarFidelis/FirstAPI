import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import usuariosRoutes from './src/routes/usuarios.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json()) // ✅ TEM QUE VIR ANTES DAS ROTAS

app.use('/usuarios', usuariosRoutes)

app.get('/', (req, res) => {
  res.send('API Monetra rodando 🚀')
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})