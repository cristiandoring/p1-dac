const express = require('express');
const VoluntarioController = require('../controllers/voluntarioController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', autenticar, VoluntarioController.listar);
router.get('/:id', autenticar, VoluntarioController.buscarPorId);
router.post('/', autenticar, autorizar('admin'), VoluntarioController.criar);
router.put('/:id', autenticar, autorizar('admin'), VoluntarioController.atualizar);
router.delete('/:id', autenticar, autorizar('admin'), VoluntarioController.excluir);

module.exports = router;
