const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const eventoRoutes = require('./routes/eventoRoutes');
const voluntarioRoutes = require('./routes/voluntarioRoutes');
const inscricaoRoutes = require('./routes/inscricaoRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API de voluntariado do IFRS no ar.' });
});

app.use('/events/:eventoId/volunteers', inscricaoRoutes);
app.use('/events', eventoRoutes);
app.use('/volunteers', voluntarioRoutes);

// Deve ser o último: só captura erros de rotas registradas antes dele
app.use(errorMiddleware);

module.exports = app;