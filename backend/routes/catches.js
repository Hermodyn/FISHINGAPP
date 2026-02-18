const express = require('express');
const router = express.Router();
const catchesController = require('../controllers/catchesController');

router.get('/', catchesController.getAllCatches);
router.get('/:id', catchesController.getCatchById);
router.post('/', catchesController.createCatch);
router.put('/:id', catchesController.updateCatch);
router.delete('/:id', catchesController.deleteCatch);

module.exports = router;
