import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      categoriaId TEXT,
      estado TEXT,
      puntuacion REAL,
      fechaRegistro TEXT,
      fechaActividad TEXT,
      notas TEXT,
      atributos TEXT,
      activo INTEGER DEFAULT 1
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS registros (
      id SERIAL PRIMARY KEY,
      itemId TEXT REFERENCES items(id),
      fecha TEXT,
      valor REAL,
      notas TEXT
    )
  `)

  console.log('Tablas listas')
}

export default pool