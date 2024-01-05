'use strict'

const Evento = require('../models/model');
const fs = require('fs-extra');
const dotenv = require('dotenv');

dotenv.config();

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
const Cloud = cloudinary.v2;

var Controller = {

    home: async function(req, res){

        try{
            const eventos = await Evento.find({}).exec();

            return res.status(200).send(eventos);
        }catch(err){
            return res.status(500).send({
                message: "No se pudieron obtener los datos"
            });
        };
    },
    evento: async function(req, res){
        var eventoId = req.params.id;

        try{
            const evento = await Evento.findById(eventoId).exec();

            return res.status(200).send({evento});
        }catch(err){
            return res.status(500).send({
                message: "No se obtuvo ningun evento"
            });
        }
    },
    nuevoEvento : async function(req, res){
        var evento = new Evento();
        var params = req.body

        evento.evento = params.evento

        try{
            const guardarEvento = await evento.save();
            return res.status(200).send({guardarEvento});
        }catch(err){
            return res.status(500).send({
                message: "No se creo un nuevo evento"
            });
        }
    },
    actualizarEvento: async function(req, res){
        var eventoId = req.params.id;
        var acutalizacion = req.body;

        try{
            const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, acutalizacion, {new: true});

            return res.status(200).send({eventoActualizado});
        }catch(err){
            return res.status(500).send({
                message: "No se pudo actualizar el evento"
            });
        }
    },
    eliminarEvento: async function(req, res){
        const eventoId = req.params.id;

        try{
            await Evento.findByIdAndDelete(eventoId);

            const eventos = await Evento.find().exec();

            res.status(200).send({eventos})
        }catch(err){
            res.status(500).send({
                message: "Hubo un error al eliminar el evento"
            })
        }
    },
    nuevoInvitado: async function(req, res){
        var eventoId = req.params.id;
        var nuevoInvitado = req.body

        try{
            const evento = await Evento.findById(eventoId);
            evento.invitados.push(nuevoInvitado);
            await evento.save();
    
            return res.status(200).send({evento});
        }catch(err){
            return res.status(500).send({
                message: "Fallo al agregar el nuevo invitado"
            });
        }
    },
    editarInvitado: async function(req, res){
        var eventoId = req.params.eventoId;
        var invitadoId = req.params.invitadoId;
        var actualizacion = req.body;

        try{
            const evento = await Evento.findById(eventoId);
            const invitado = evento.invitados.find(invitado => invitado._id == invitadoId);

            Object.assign(invitado, actualizacion);
            await evento.save();

            return res.status(200).send({evento});
        }catch(err){
            return res.status(500).send({
                message: "No poudimos actualizar el invitado"
            });
        }
    },
    invitado: async function(req, res){
        var eventoId= req.params.eventoId;
        var invitadoId = req.params.invitadoId;

        try{
            const evento = await Evento.findById(eventoId).exec();
            const invitado = evento.invitados.find(invitado => invitado._id == invitadoId);

            const invitacion = {
                ...evento.toObject(),
                invitados: invitado
            }

            return res.status(200).send(invitacion);
        }catch(err){
            return res.status(500).send({
                message: "No pudimos obtener la invitacion que buscas"
            })
        }
    },
    nuevoItinerario: async function(req, res){
        var eventoId = req.params.id;
        var itinerario = req.body;

        try{
            const iconoCloud = await Cloud.uploader.upload(req.file.path); 
            const evento = await Evento.findById(eventoId);

            const nuevoItinerario = {
                accion: itinerario.accion,
                ubicacion : itinerario.ubicacion,
                icono: iconoCloud.secure_url,
                hora: itinerario.hora,
                direccion: itinerario.direccion
            };

            evento.itinerario.push(nuevoItinerario);

            await evento.save();
            await fs.unlink(req.file.path);

            return res.status(200).send({evento})
        }catch(err){
            return res.status(500).send({
                message: "no fue posible guardar el itinerario"
            })
        }
    },
    editarItinerario: async function(req, res){

    },
    eliminarItinerario: async function(req, res){

    },
    nuevaImagenCarousel: async function(req, res){
        const eventoId = req.params.id;
        
        try{
            const imagenCloud = await Cloud.uploader.upload(req.file.path);
            
            const evento = await Evento.findById(eventoId);

            const imagen = {
                imageURL: imagenCloud.secure_url,
                public_id: imagenCloud.public_id
            };

            evento.multimedia.carousel.push(imagen);

            await evento.save();

            await fs.unlink(req.file.path);

            res.status(200).send({evento});
        }catch(err){
            res.status(500).send({
                meesage: "No se a subido la imagen"
            })
        }
    },
    eliminarImagenCarousel: async function(req, res){
        const eventoId = req.params.eventoId;
        const imagenId = req.params.imagenId;

        try{
            const evento = await Evento.findById(eventoId);
            const imagen = evento.multimedia.carousel.find(carousel => carousel._id == imagenId);

            await cloudinary.uploader.destroy(imagen.public_id);
            evento.multimedia.carousel.pull(imagen);

            await evento.save();

            res.status(200).send({evento});
        }catch(err){
            res.status(500).send({
                message: "No se pudo eliminar la imagen"
            })
        }
    },
    nuevaImagenGaleria: async function(req, res){
        const eventoId = req.params.id;
        
        try{
            const imagenCloud = await Cloud.uploader.upload(req.file.path);
            
            const evento = await Evento.findById(eventoId);

            const imagen = {
                imageURL: imagenCloud.secure_url,
                public_id: imagenCloud.public_id
            };

            evento.multimedia.galeria.push(imagen);

            await evento.save();

            await fs.unlink(req.file.path);

            res.status(200).send({evento});
        }catch(err){
            res.status(500).send({
                meesage: "No se a subido la imagen"
            })
        }
    },
    nuevoFondo: async function(req, res){
        const eventoId = req.params.id;
        
        try{
            const imagenCloud = await Cloud.uploader.upload(req.file.path);
            
            const evento = await Evento.findById(eventoId);

            evento.multimedia.fondo = {
                imageURL: imagenCloud.secure_url,
                public_id: imagenCloud.public_id
            };

            await evento.save();

            await fs.unlink(req.file.path);

            res.status(200).send({evento});
        }catch(err){
            res.status(500).send({
                meesage: "No se a subido la imagen"
            })
        }
    },
    nuevaPortada: async function(req, res){
        const eventoId = req.params.id;
        
        try{
            const imagenCloud = await Cloud.uploader.upload(req.file.path);
            
            const evento = await Evento.findById(eventoId);

            const imagen = {
                imageURL: imagenCloud.secure_url,
                public_id: imagenCloud.public_id
            };

            evento.multimedia.portada.push(imagen);

            await evento.save();

            await fs.unlink(req.file.path);

            res.status(200).send({evento});
        }catch(err){
            console.log(err);
            res.status(500).send({
                meesage: "No se a subido la imagen"
            })
        }
    },
    nuevaImagenFlor: async function(req, res){
        const eventoId = req.params.id;
        
        try{
            const imagenCloud = await Cloud.uploader.upload(req.file.path);
            
            const evento = await Evento.findById(eventoId);

            evento.multimedia.flor = {
                imageURL: imagenCloud.secure_url,
                public_id: imagenCloud.public_id
            };

            await evento.save();

            await fs.unlink(req.file.path);

            res.status(200).send({evento});
        }catch(err){
            res.status(500).send({
                meesage: "No se a subido la imagen"
            })
        }
    },
    nuevaCancion: async function(req, res){
        const eventoId = req.params.id;
        
        try{
            const audioCloud = await Cloud.uploader.upload(req.file.path, { resource_type: "video" });
            
            const evento = await Evento.findById(eventoId);

            evento.multimedia.cancion = {
                audioURL: audioCloud.secure_url,
                public_id: audioCloud.public_id
            };

            await evento.save();

            await fs.unlink(req.file.path);

            res.status(200).send({evento});
        }catch(err){
            console.log(err)
            res.status(500).send({
                meesage: "No se a subido la cancion"
            })
        }
    },
    nuevaMesa: async function(req, res){
        const eventoId = req.params.id;
        const mesa = req.body;

        try{
            const iconCloud = await Cloud.uploader.upload(req.file.path);
            const evento = await Evento.findById(eventoId);

            const nuevaMesa = {
                modalidad: mesa.modalidad,
                icono: iconCloud.secure_url,
                explicacion: mesa.explicacion,
                codigo: mesa.codigo
            }

            evento.mesaDeRegalos.push(nuevaMesa);
            await evento.save();

            await fs.unlink(req.file.path);

            res.status(200).send({evento});
        }catch(err){
            console.log(err);
            res.status(500).send({
                message: "No se pudo agregar la mesa de regalos"
            })
        }
    }
    
};

module.exports = Controller;