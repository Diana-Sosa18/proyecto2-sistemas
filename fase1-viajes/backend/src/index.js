import express from 'express'
import cors from 'cors'
import { initDB } from './db/database.js'
import itemsRouter from './routes/items.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}))
app.use(express.json())

app.use('/api/items', itemsRouter)

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
  })
})