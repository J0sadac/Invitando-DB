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
router.post('/evento/:id/carousel', Controller.imgCarousel);

router.put('/evento/:eventoId/invitado/:invitadoId/editar', Controller.editarInvitado);

router.delete('/evento/:eventoId/invitado/:invitadoId', Controller.eliminarInvitado);

export default router;

