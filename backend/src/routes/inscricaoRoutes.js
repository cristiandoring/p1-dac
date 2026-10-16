const express = require('express');
const InscricaoController = require('../controllers/inscricaoController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

// mergeParams permite ler :eventoId, que vem do caminho definido no app.js
const router = express.Router({ mergeParams: true });

router.get('/', autenticar, InscricaoController.listar);
router.post('/', autenticar, autorizar('admin'), InscricaoController.inscrever);
router.delete('/:voluntarioId', autenticar, autorizar('admin'), InscricaoController.cancelar);

module.exports = router;
