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
  editarInvitado: async function(req, res) {
    const { eventoId, invitadoId } = req.params;
    const actualizacion = req.body;

    try{
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).send({ message: "Evento no encontrado" });
        }

        const invitado = evento.invitados.find(inv => inv._id.toString() === invitadoId);
        if (!invitado) {
            return res.status(404).send({ message: "Invitado no encontrado" });
        }

        Object.assign(invitado, actualizacion);
        await evento.save();

        return res.status(200).send({ invitado, evento });
    }catch(err) {
        console.error(err);
        return res.status(500).send({
            message: "No pudimos actualizar el invitado"
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
  obtenerInvitados: async function(req, res){
    var eventoId = req.params.eventoId;
    
    try{
      const evento = await Evento.findById(eventoId).exec();
      const lista = evento.invitados;

      return res.status(200).send(lista);
      
    }catch(err){
      console.log(err);
      return res.status(500).send({
        message: 'No se obtuvo la lista de invitados'
      })
    }
  },
  invitacion: async function(req, res){
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
      .select('datos.festejado datos.fecha datos.dia multimedia.preportada invitados');

      const filtro = eventos.filter(evento => {
        const festejado = evento.datos?.festejado;
        const fecha = evento.datos?.fecha;
        const dia = evento.datos?.dia;
        const preportada = evento.multimedia?.preportada?.[0]?.url;
        const invitado = evento.invitados?.[0];

        return (
          festejado &&
          fecha &&
          dia &&
          preportada &&
          invitado &&
          invitado._id &&
          invitado.invitado
        );
      });

      const filtrado = filtro.map(evento => {
        const invitado = evento.invitados?.[0];

        return{
          id: evento._id,
          datos: evento.datos,
          multimedia: evento.multimedia,
          invitado: invitado._id
        };
      });

      res.json(filtrado);

    }catch(err){
      res.status(500).json({
        message: 'No pudimos obtener la lista de eventos por el siguiente error:',
        error: err
      });
    };
  },
  subirImagen: async (req, res, options) => {
    const eventoID = req.params.id;
    const { seccion, multiples = false } = options;

    try {
        const files = multiples
          ? (Array.isArray(req.files?.files) ? req.files.files : [req.files?.files])
          : [req.files?.file];

        const evento = await Evento.findById(eventoID);
        const imagenes = [];

        if (!evento)
          return res.status(404).json({
            message: "Evento no encontrado.",
          });

        for (const file of files) {
          if (!file) continue;

          const stream = fs.createReadStream(file.tempFilePath);

          const uploadParams = {
            Bucket: AWS_BUCKET_NAME,
            Key: file.name,
            Body: stream,
            ContentType: file.mimetype,
          };

          const command = new PutObjectCommand(uploadParams);
          await client.send(command);

          const imgUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${file.name}`;
          const imagen = {
            url: imgUrl,
            public_id: file.name,
          };

          imagenes.push(imagen);
          await fsExtra.unlink(file.tempFilePath);
        }

        const keys = seccion.split(".");
        let current = evento;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }

        const targetKey = keys[keys.length - 1];

        if (Array.isArray(current[targetKey])) {
          current[targetKey].push(...imagenes);
        } else {
          current[targetKey] = multiples ? imagenes : imagenes[0];
        }

        await evento.save();

        res.status(200).json(imagenes);
      } catch (err) {
        console.error(err);
        res.status(500).json({
          message: "Hay un error al intentar subir las imágenes.",
        });
      }
  },
  subirDatos: async (req, res, options) => {
    const eventoID = req.params.id;
    const { datosSeccion, multiples = false, propiedad = "imagen" } = options;

    try {
      const evento = await Evento.findById(eventoID);
      if (!evento)
        return res.status(404).json({ message: "Evento no encontrado." });

      const files = multiples ? req.files.files : [req.files.file];
      const imagenes = [];

      for (const file of files) {
        const stream = fs.createReadStream(file.tempFilePath);

        const uploadParams = {
          Bucket: AWS_BUCKET_NAME,
          Key: file.name,
          Body: stream,
          ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(uploadParams);
        await client.send(command);

        const imgUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${file.name}`;

        const imagenObj = {};
        imagenObj[propiedad] = imgUrl; 

        imagenes.push(imagenObj);

        await fsExtra.unlink(file.tempFilePath);
      }

      const keys = datosSeccion.split(".");
      let current = evento;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      const targetKey = keys[keys.length - 1];

      const datos = {
        ...req.body,
        [propiedad]: multiples ? imagenes : imagenes[0][propiedad],
      };

      if (Array.isArray(current[targetKey])) {
        current[targetKey].push(datos);
      } else if (typeof current[targetKey] === 'object') {
        current[targetKey] = { ...current[targetKey], ...datos };
      } else {
        current[targetKey] = datos;
      }

      
      await evento.save();

      res.status(200).json({
        mensaje: "Datos subidos correctamente.",
        datos,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error al subir los datos o las imágenes." });
    }
  }

};

export default Controller;
