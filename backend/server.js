require('dotenv').config();

const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);

  try {
    await pool.query('SELECT 1');
    console.log('Conectado ao banco de dados MySQL com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
  }
});
