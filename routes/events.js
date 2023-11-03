const express = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

const router = express.Router()

// todas tienen que estar validadas (JWT)
// obtener eventos
router.use(validarJWT)

router.get('/',getEventos);
// Crear un nuevo evneto
router.post('/',[
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','la fecha start es obligatoria').custom(isDate),
    check('end','la fecha end es obligatoria').custom(isDate),
    validarCampos
],crearEvento);

// Actualizar eventos
router.put('/:id',actualizarEvento)

// borrar evento
router.delete('/:id',eliminarEvento);

module.exports = router;