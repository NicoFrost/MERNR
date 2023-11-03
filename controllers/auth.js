const {response} = require('express');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');
const crearUsuario = async (req,resp = response) => {

    const {email,password} = req.body;

    try {
        let usuario = await Usuario.findOne({email})

        if(usuario) {
            return resp.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo'
            })
        }
        usuario = new Usuario(req.body)

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt);
        
        await usuario.save();

        const token = await generarJWT(usuario.id,usuario.name);

        return resp.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            msg: 'registro',
            token
        })
    } catch (error) {
        return resp.status(500).json({
            ok: false,
            msg: 'por favor hable con el administrador'
        })
    }
}

const loginUsuario = async (req,resp = response) => {

    const {email,password} = req.body;
    
    try {
        const usuario = await Usuario.findOne({email})
        
        if(!usuario) {
            return resp.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            })
        }

        // Confirmar los password

        const validPassword = bcrypt.compareSync(password,usuario.password);

        if(!validPassword) {
            return resp.status(400).json({
                ok: false,
                msg: 'Pasword Incorrecta'
            })
        }

        // Generar nuestro JWT
        const token = await generarJWT(usuario.id,usuario.name);

        resp.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const revalidarToken = async (req,resp = response) => {
    
    const {uid,name} = req;
    
    const token = await generarJWT(uid,name);
    resp.json({
        ok:'true',
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}