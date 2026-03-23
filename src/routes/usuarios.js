import express from 'express'
import { supabase } from '../config/supabase.js'

const router = express.Router()

const planosValidos = ['FREE', 'PRO', 'PREMIUM']

// Criar usuário
router.post('/', async (req, res) => {
  const { nome, email, plano } = req.body

  // validação simples
  if (!nome || !email || !plano) {
    return res.status(400).json({ erro: 'Preencha todos os campos' })
  }

  if (!planosValidos.includes(plano)) {
    return res.status(400).json({ erro: 'Plano inválido' })
  }

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nome, email, plano }])
    .select() // ✅ força retorno

  if (error) return res.status(400).json(error)

  res.json(data)
})

// Listar usuários
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')

  if (error) return res.status(400).json(error)

  res.json(data)
})

// Atualizar plano
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { plano } = req.body

  if (!planosValidos.includes(plano)) {
    return res.status(400).json({ erro: 'Plano inválido' })
  }

  const { data, error } = await supabase
    .from('usuarios')
    .update({ plano })
    .eq('id', id)
    .select()

  if (error) return res.status(400).json(error)

  res.json(data)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id)
    .select()

  if (error) return res.status(400).json(error)

  res.json(data)
})

export default router