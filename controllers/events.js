const {response} = require('express')
const Evento = require('../models/Events')
const monsgoose = require('mongoose');

const getEventos = async (req,resp = response) => {

    const eventos = await Evento.find()
                                .populate('user','name')
                                

    resp.status(200).json({
        ok:true,
        eventos
    })
}

const crearEvento = async (req,resp = response) => {

    const evento = new Evento(req.body);
    console.log(req);
    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save()
        resp.status(200).json({
            ok:true,
            evento: eventoGuardado
        })
    } catch (error) {
        console.log(error);
        resp.status(401).json({
            ok:false,
            msg: 'hable con el administrador'
        })        
    }
    

}
const actualizarEvento = async (req,resp = response) => {
    
    const eventoId = req.params.id;

    try {
        const evento = await Evento.findById(eventoId);
        const uid = req.uid;
        if(!evento){
            return resp.status(404).json({
                ok:false,
                msg:'Evento no existe con ese ID'
            })
        }
        
        if(evento.user.toString() !== uid){ 
            return resp.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId,nuevoEvento,{new:true})

        return resp.json({
            ok:true,
            evento: eventoActualizado
        })
    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}
const eliminarEvento = async (req,resp = response) => {
    const eventoId = req.params.id;

    try {
        const evento = await Evento.findById(eventoId);
        const uid = req.uid;
        if(!evento){
            return resp.status(404).json({
                ok:false,
                msg:'Evento no existe con ese ID'
            })
        }
        
        if(evento.user.toString() !== uid){ 
            return resp.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de eliminar'
            })
        }

        const eventoEliminado = await Evento.findByIdAndDelete(eventoId)

        return resp.json({
            ok:true,
            evento: eventoEliminado,
            msg: 'evento eliminado'
        })
    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}