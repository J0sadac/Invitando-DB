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

            return res.status(200).send(evento);
        }catch(err){
            return res.status(500).send({
                message: "No se obtuvo ningun evento"
            });
        }
    },
    nuevoEvento : async function(req, res){
        const Datos= req.body;

        const eventoNuevo = new Evento({
            evento: Datos.evento,
            datos: {
                festejado: Datos.festejado,
                novios: {
                    novio: Datos.novio,
                    novia: Datos.novia
                },
                fecha: Datos.fecha,
                lugar: {
                    salon: Datos.salon,
                    direccion: Datos.direccion,
                    ciudad: Datos.ciudad
                }
            }
        });

        try{
            const datosEvento = await eventoNuevo.save();

            return res.status(200).send({datosEvento});
        }catch(err){
            console.log(err);

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
        var datos = req.body

        try{
            const evento = await Evento.findById(eventoId);

            const invitado ={
                mesa: datos.mesa,
                invitado: datos.invitado,
                pase: datos.pase,
                infantes: datos.infantes,
                telefono: datos.telefono,
                asistir: datos.asistir,
                de: datos.de
            }

            evento.invitados.push(invitado);
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

            const invitacion = {
                ...evento.toObject(),
                invitados:invitado
            }

            return res.status(200).send({invitacion});
        }catch(err){
            return res.status(500).send({
                message: "No poudimos actualizar el invitado"
            });
        }
    },
    eliminarInvitado: async function(req, res){
        const eventoId = req.params.eventoId;
        const invitadoId = req.params.invitadoId;

        try{
            const evento = await Evento.findById(eventoId).exec();
            const invitado = evento.invitados.find(invitado => invitado._id == invitadoId);

            console.log(invitado)

            evento.invitados.pull(invitado);

            await evento.save();            

            res.status(200).send({evento})
        }catch(err){
            console.log(err)
            res.status(500).send({
                message: "Hubo un error al eliminar el evento"
            })
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
    invitacion: async function(req, res){
        const eventoId = req.params.eventoId;

        try{
            const evento = await Evento.findById(eventoId).exec();
            const invitado = evento.invitados[0];

            const invitacion ={
                ...evento.toObject(),
                invitados: [invitado]
            }

            return res.status(200).send({invitacion});
        }catch(err){
            console.log(err);

            return res.status(500).send({
                message: "No se pudo obtener la invitacion"
            });
        };
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
    nuevoPadrino: async function(req, res){
        var eventoId = req.params.id;
        var padrinos = req.body;

        try{
            const iconoCloud = await Cloud.uploader.upload(req.file.path); 
            const evento = await Evento.findById(eventoId);

            const nuevoPadrino = {
                de: padrinos.de,
                padrino : padrinos.padrino,
                icono: iconoCloud.secure_url,
            };

            evento.padrinos.push(nuevoPadrino);

            await evento.save();
            await fs.unlink(req.file.path);

            return res.status(200).send({evento})
        }catch(err){
            return res.status(500).send({
                message: "no fue posible guardar el padrino"
            })
        }
    },
    nuevoVestimenta: async function(req, res){
        var eventoId = req.params.id;
        var vestimenta = req.body;

        try{
            const iconoCloud = await Cloud.uploader.upload(req.file.path); 
            const evento = await Evento.findById(eventoId);

            const nuevaVestimenta = {
                iconoHombre: iconoCloud.secure_url,
                iconoMujer: iconoCloud.secure_url,
                hombre: vestimenta.hombre,
                mujer: vestimenta.mujer
            };

            evento.vestiemnta.push(nuevaVestimenta);

            await evento.save();
            await fs.unlink(req.file.path);

            return res.status(200).send({evento})
        }catch(err){
            return res.status(500).send({
                message: "no fue posible guardar el itinerario"
            })
        }
    },
    nuevosPadres: async function(req, res){
        var eventoId = req.params.id;
        var padres = req.body;

        try{ 
            const evento = await Evento.findById(eventoId);

            const nuevosPapas = {
                papa: padres.papa,
                mama: padres.mama
            };

            evento.datos.padres.push(nuevosPapas);

            await evento.save();

            return res.status(200).send({evento})
        }catch(err){
            console.log(err)
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
                url: imagenCloud.secure_url,
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
                url: imagenCloud.secure_url,
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
                url: imagenCloud.secure_url,
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
                url: imagenCloud.secure_url,
                public_id: imagenCloud.public_id
            };

            evento.multimedia.portada.push(imagen);

            await evento.save();

            await fs.unlink(req.file.path);

            res.status(200).send(evento);
        }catch(err){
            console.log(err);
            res.status(500).send({
                meesage: "No se a subido la imagen"
            })
        }
    },
    nuevaPrePortada: async function(req, res){
        const eventoId = req.params.id;
        
        try{
            const imagenCloud = await Cloud.uploader.upload(req.file.path);
            
            const evento = await Evento.findById(eventoId);

            const imagen = {
                url: imagenCloud.secure_url,
                public_id: imagenCloud.public_id
            };

            evento.multimedia.preportada.push(imagen);

            await evento.save();

            await fs.unlink(req.file.path);

            res.status(200).send(evento);
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
                url: imagenCloud.secure_url,
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
                url: audioCloud.secure_url,
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