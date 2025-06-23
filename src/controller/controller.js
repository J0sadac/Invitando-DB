// ./controller/controller.js
import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { AWS_ACCES_KEY_ID, AWS_BUCKET_NAME, AWS_REGION, AWS_SECRET_ACCES_KEY } from '../config.js';
import fs from 'fs';
import fsExtra from 'fs-extra';

import Evento from '../models/model.js';

const client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCES_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCES_KEY
  }
});

const Controller = {
  home: async (req, res) => {
    try {
      const eventos = await Evento.find({}).exec();
      return res.status(200).json(eventos);
    } catch (err) {
      return res.status(500).json({ message: "No se pudieron obtener los datos" });
    }
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
  ejemplos: async function(req, res){
    const clase = req.params.clase;

    const tipos = {
      xv: 'XV Años',
      boda: 'Boda'
    };

    const claseEvento = tipos[clase.toLowerCase()];

    try{
      const eventos = await Evento.find({evento: claseEvento})
      .select('datos.festejado datos.fecha datos.dia multimedia.preportada');

      res.json(eventos);

    }catch(err){
      res.status(500).json({message: 'No pudimos obtener la lista de eventos por el siguiente error:', err})
    }

  },
  imgCarousel: async (req, res) => {
    const eventoId = req.params.id;

    try {
      const file = req.files.file;

      const stream = fs.createReadStream(file.tempFilePath);

      const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.name, // Asegúrate de que no se repita si subes varias veces
        Body: stream,
        ContentType: file.mimetype
      };

      const command = new PutObjectCommand(uploadParams);
      await client.send(command);

      const imageUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${file.name}`;

      const evento = await Evento.findById(eventoId);

      const imagen = {
        url: imageUrl,
        key: file.name
      };

      evento.multimedia.carousel.push(imagen);
      await evento.save();

      const imagenes = evento.multimedia.carousel;

      await fsExtra.unlink(file.tempFilePath);

      res.status(200).json({ imagenes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al subir el archivo' });
    }
  }
};

export default Controller;
