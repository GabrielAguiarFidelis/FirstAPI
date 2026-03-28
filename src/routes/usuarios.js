import express from 'express'
import { supabase } from '../config/supabase.js'
import bcrypt from 'bcrypt'

const router = express.Router()

const planosValidos = ['FREE', 'PRO', 'PREMIUM']

// 🔹 CREATE (POST)
router.post('/', async (req, res) => {
  const { nome, email, password, plano } = req.body

  if (!nome || !email || !password || !plano) {
    return res.status(400).json({ error: 'Preencha todos os campos' })
  }

  if (!planosValidos.includes(plano)) {
    return res.status(400).json({ error: 'Plano inválido' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nome, email, password: hashedPassword, plano }])
      .select()

    if (error) throw error

    res.status(201).json(data[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// 🔹 READ ALL (GET)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')

    if (error) throw error

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// 🔹 READ BY ID (GET)
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    res.json(data)
  } catch (err) {
    res.status(404).json({ error: 'Usuário não encontrado' })
  }
})


// 🔹 UPDATE (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { nome, email, password, plano } = req.body

  try {
    let updateData = {}

    if (nome) updateData.nome = nome
    if (email) updateData.email = email

    if (plano) {
      if (!planosValidos.includes(plano)) {
        return res.status(400).json({ error: 'Plano inválido' })
      }
      updateData.plano = plano
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const { data, error } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error

    res.json(data[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// 🔹 DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ message: 'Usuário deletado com sucesso' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router