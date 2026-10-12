const express = require('express');
const InscricaoController = require('../controllers/inscricaoController');

// mergeParams permite ler :eventoId, que vem do caminho definido no app.js
const router = express.Router({ mergeParams: true });

router.get('/', InscricaoController.listar);
router.post('/', InscricaoController.inscrever);
router.delete('/:voluntarioId', InscricaoController.cancelar);

module.exports = router;