// ./router/router.js
'use strict'

import express from 'express';
import Controller from '../controller/controller.js';

const router = express.Router();

//Rutas get
router.get('/eventos', Controller.home);
router.get('/evento/:id', Controller.evento);
router.get('/evento/:eventoId/invitado/:invitadoId', Controller.invitacion);
router.get('/eventos/:clase', Controller.ejemplos);
router.get('/invitados/:eventoId', Controller.obtenerInvitados);

//Rutas post
router.post('/evento/:id/invitado', Controller.nuevoInvitado);
//Post para subir imagenes
router.post('/evento/:id/portada', (req, res) => {
  Controller.subirImagen(req, res, { seccion: 'multimedia.portada', multiples: false });
});
router.post('/evento/:id/preportada', (req, res) => {
  Controller.subirImagen(req, res, { seccion: 'multimedia.preportada', multiples: false });
});
router.post('/evento/:id/galeria', (req, res) => {
  Controller.subirImagen(req, res, { seccion: 'multimedia.carousel', multiples: true });
});
router.post('/evento/:id/fondo/primero', (req, res) => {
  Controller.subirImagen(req, res, { seccion: 'multimedia.fondos.primero', multiples: false });
});
router.post('/evento/:id/fondo/segundo', (req, res) => {
  Controller.subirImagen(req, res, { seccion: 'multimedia.fondos.segundo', multiples: false });
});
router.post('/evento/:id/fondo/tercero', (req, res) => {
  Controller.subirImagen(req, res, { seccion: 'multimedia.fondos.tercero', multiples: false });
});
router.post('/evento/:id/fondo/invitacion', (req, res) => {
  Controller.subirDatos(req, res, {  
    propiedad: 'fondo', 
    multiples: false,
    datosSeccion: 'estilos.estilosInvitacion'
  });
});
router.post('/evento/:id/cancion', (req, res) => {
  Controller.subirImagen(req, res, { seccion: 'multimedia.cancion', multiples: false });
});

//Post para subir datos
router.post('/evento/:id/pensamiento', (req, res) => {
  Controller.subirDatosRobustos(req, res, {
    propiedad: 'imagen',
    datosSeccion: 'pensamiento',
    multiples: false
  });
});
router.post('/evento/:id/ubicacion', (req, res) => {
  Controller.subirDatos(req, res, {
    propiedad: 'foto',
    datosSeccion: 'ubicacion',
    multiples: false
  });
});
router.post('/evento/:id/recomendacion', (req, res) => {
  Controller.subirDatos(req, res, {
    propiedad: 'foto',
    datosSeccion: 'datos.recomendacion',
    multiples: false
  });
});
router.post('/evento/:id/hashtag', (req, res) => {
  Controller.subirDatos(req, res, {
    propiedad: 'codigo',
    datosSeccion: 'hashtag',
    multiples: false
  });
});
router.post('/evento/:id/padrinos', (req, res) => {
  Controller.subirDatos(req, res, {
    propiedad: 'icono',
    datosSeccion: 'padrinos',
    multiples: false
  });
});
router.post('/evento/:id/estilos/invitacion', (req, res) => {
  Controller.subirDatos(req, res, {
    propiedad: 'fondo',
    datosSeccion: 'estilos.estilosInvitacion',
    multiples: false
  });
});

//Rutas put
router.put('/evento/:eventoId/invitado/:invitadoId/editar', Controller.editarInvitado);

//Rutas delete
router.delete('/evento/:eventoId/invitado/:invitadoId', Controller.eliminarInvitado);

export default router;