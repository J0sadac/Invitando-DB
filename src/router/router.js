'use strict'

var express = require('express');
var EventoController = require('../controller/controller');

var router = express.Router();


router.get('/eventos', EventoController.home);
router.post('/evento', EventoController.nuevoEvento);
router.get('/evento/:id', EventoController.evento);
router.put('/evento/:id/editar', EventoController.actualizarEvento);
router.delete('/evento/:id', EventoController.eliminarEvento);
router.post('/evento/:id/invitado', EventoController.nuevoInvitado);
router.get('/evento/:eventoId/invitado/:invitadoId', EventoController.invitado);
router.put('/evento/:eventoId/invitado/:invitadoId/editar', EventoController.editarInvitado);
router.delete('/evento/:eventoId/invitado/:invitadoId', EventoController.eliminarInvitado);
router.get('/mi-evento/:eventoId', EventoController.invitacion);
router.post('/evento/:id/itinerario', EventoController.nuevoItinerario);
router.post('/evento/:id/padrino', EventoController.nuevoPadrino);
router.post('/evento/:id/vestimenta', EventoController.nuevoVestimenta);
router.post('/evento/:id/carousel', EventoController.nuevaImagenCarousel);
router.post('/evento/:id/fondo/primero', EventoController.nuevoFondoPrimero);
router.post('/evento/:id/fondo/segundo', EventoController.nuevoFondoSegundo);
router.post('/evento/:id/fondo/tercero', EventoController.nuevoFondoTercero);
router.delete('/evento/:eventoId/fotos/:imagenId', EventoController.eliminarImagenCarousel);
router.post('/evento/:id/galeria', EventoController.nuevaImagenGaleria);
router.post('/evento/:id/mesa', EventoController.nuevaMesa);
router.post('/evento/:id/ubicacion', EventoController.nuevaUbicacion);
router.post('/evento/:id/fondo', EventoController.nuevoFondo);
router.post('/evento/:id/portada', EventoController.nuevaPortada);
router.post('/evento/:id/preportada', EventoController.nuevaPrePortada);
router.post('/evento/:id/flor', EventoController.nuevaImagenFlor);
router.post('/evento/:id/cancion', EventoController.nuevaCancion);
router.post('/evento/:id/padres', EventoController.nuevosPadres);
router.post('/evento/:id/estilos/galeria', EventoController.nuevosEstilosGaleria);
router.post('/evento/:id/estilos/invitacion', EventoController.nuevosEstilosInvitacion);
router.post('/evento/:id/estilos/vestimenta', EventoController.nuevosEstilosVestimenta);
router.post('/evento/:id/frase/3', EventoController.nuevaFraseTres);
router.post('/evento/:id/timeline', EventoController.nuevaTimeLine);

module.exports = router;