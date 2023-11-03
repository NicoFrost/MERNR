
/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const {Router} = require('express');
const router = Router();
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
    '/new',
    [
        check('name','el nombre es obligatorio').not().isEmpty(),
        check('email','el emaiol es obligatorio').isEmail(),
        check('password','el nombre es obligatorio').isLength({min:6}),
        validarCampos
    ],
    crearUsuario
);

router.post(
    '/',
    [
        check('email','debe ser un email valido').isEmail(),
        check('password','la password debe de ser de 6 letras').isLength({min:6}),
        validarCampos
    ],
    loginUsuario);
router.get('/renew',validarJWT,revalidarToken);



module.exports = router