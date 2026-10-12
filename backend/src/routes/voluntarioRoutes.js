const express = require('express');
const VoluntarioController = require('../controllers/voluntarioController');

const router = express.Router();

router.get('/', VoluntarioController.listar);
router.get('/:id', VoluntarioController.buscarPorId);
router.post('/', VoluntarioController.criar);
router.put('/:id', VoluntarioController.atualizar);
router.delete('/:id', VoluntarioController.excluir);

module.exports = router;