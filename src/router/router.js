// ./router/router.js
'use strict'

import express from 'express';
import Controller from '../controller/controller.js';

const router = express.Router();

router.get('/eventos', Controller.home);
router.get('/evento/:id', Controller.evento);
router.get('/evento/:eventoId/invitado/:invitadoId', Controller.invitado);
router.get('/eventos/:clase', Controller.ejemplos);

router.post('/evento/:id/invitado', Controller.nuevoInvitado);
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

router.put('/evento/:eventoId/invitado/:invitadoId/editar', Controller.editarInvitado);

router.delete('/evento/:eventoId/invitado/:invitadoId', Controller.eliminarInvitado);

export default router;