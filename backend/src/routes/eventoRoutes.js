const express = require('express');
const EventoController = require('../controllers/eventoController');

const router = express.Router();

router.get('/', EventoController.listar);
router.get('/:id', EventoController.buscarPorId);
router.post('/', EventoController.criar);
router.put('/:id', EventoController.atualizar);
router.delete('/:id', EventoController.excluir);

module.exports = router;