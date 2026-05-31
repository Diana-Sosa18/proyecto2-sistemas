import express from 'express'
import pool from '../db/database.js'

const router = express.Router()

//pedir datos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items WHERE activo = 1')
    const items = result.rows.map(row => ({
      ...row,
      atributos: JSON.parse(row.atributos || '{}'),
      activo: row.activo === 1
    }))
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//enviar datos nuevos
router.post('/', async (req, res) => {
  try {
    const { id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, atributos, activo } = req.body
    await pool.query(
      `INSERT INTO items (id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, atributos, activo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, JSON.stringify(atributos), activo ? 1 : 0]
    )
    res.status(201).json({ mensaje: 'Item creado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//actualizar datos
router.put('/:id', async (req, res) => {
  try {
    const { nombre, categoriaId, estado, puntuacion, fechaActividad, notas, atributos } = req.body
    await pool.query(
      `UPDATE items SET nombre=$1, categoriaId=$2, estado=$3, puntuacion=$4, fechaActividad=$5, notas=$6, atributos=$7
       WHERE id=$8`,
      [nombre, categoriaId, estado, puntuacion, fechaActividad, notas, JSON.stringify(atributos), req.params.id]
    )
    res.json({ mensaje: 'Item actualizado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//archivar
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('UPDATE items SET activo=0 WHERE id=$1', [req.params.id])
    res.json({ mensaje: 'Item archivado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//crear registro 
router.post('/:id/registro', async (req, res) => {
  try {
    const { fecha, valor, notas } = req.body
    await pool.query(
      'INSERT INTO registros (itemId, fecha, valor, notas) VALUES ($1,$2,$3,$4)',
      [req.params.id, fecha, valor, notas]
    )
    res.status(201).json({ mensaje: 'Registro creado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router