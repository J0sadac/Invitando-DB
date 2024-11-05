'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventoSchema = Schema({
    evento: {
        type: String,
        required: false
    },
    modelo: {
        type: Number,
        required: false
    },
    datos: {
        festejado: {
            type: String,
            required: false
        },
        novios: {
            novio: {
                type: String,
                required: false
            },
            novia: {
                type: String,
                required: false
            }
        },
        padres: [{
            papa: {
                type: String,
                required: false
            },
            mama: {
                type: String,
                required: false
            }
        }],
        fecha: {
            type: String,
            required: false
            //temporal
        },
        lugar: {
            salon: {
                type: String,
                required: false
                //temporal
            },
            direccion: {
                type: String,
                required: false
                //temporal
            },
            ciudad: {
                type: String,
                required: false
                //temporal
            }
        },
        padrinos: [{
            padrino: {
                type: String,
                required: false
            },
            de: {
                type: String,
                required: false
            }
        }],
        dia: {
            type: String,
            require: false
        }, 
        contacto:{
            nombre: {
                type: String,
                require: false
            },
            telefono: {
                type: String,
                require: false
            }
        }
    },
    padrinos: [{
        padrino: [{
            type: String,
            required: false
        }],
        de: {
            type: String,
            required: false
        },
        icono : {
            type: String,
            required: false
        }
    }],
    multimedia: {
        carousel: [{
            url: {
                type: String,
                require: false
            },
            public_id: {
                type: String,
                require: false
            }
        }],
        galeria: [{
            url: {
                type: String,
                require: false
            },
            public_id: {
                type: String,
                require: false
            }
        }],
        fondo: {
            url: {
                type: String,
                require: false
            },
            public_id: {
                type: String,
                require: false
            }
        },
        fondos: {
            primero: {
                url: {
                    type: String,
                    require: false
                },
                public_id: {
                    type: String,
                    require: false
                }
            },
            segundo: {
                url: {
                    type: String,
                    require: false
                },
                public_id: {
                    type: String,
                    require: false
                }
            },
            tercero:{
                url: {
                    type: String,
                    require: false
                },
                public_id: {
                    type: String,
                    require: false
                }
            }
        },
        cancion: {
            url: {
                type: String,
                require: false
            },
            public_id: {
                type: String,
                require: false
            }
        },
        videos: {
            url: {
                type: String,
                require: false
            },
            public_id: {
                type: String,
                require: false
            }
        },
        portada: [{
            url: {
                type: String,
                require: false
            },
            public_id: {
                type: String,
                require: false
            }
        }],
        preportada: [{
            url: {
                type: String,
                require: false
            },
            public_id: {
                type: String,
                require: false
            }
        }],
        flor: {
            url: {
                type: String,
                require: false
            },
            public_id: {
                type: String,
                require: false
            }
        }
    },
    mesaDeRegalos: [{
        modalidad: {
            type: String,
            require: false
        },
        icono: {
            type: String,
            require: false
        },
        sears: {
            type: String,
            require: false
        },
        explicacion: {
            type: String,
            require: false
        },
        codigo: {
            type: String,
            require: false
        },
        tarjeta: {
            type: String,
            require: false
        },
        banco: {
            type: String,
            require: false
        }
    }],
    frases: [{
        type: String,
        require: false
    }],
    itinerario: [{
        accion: {
            type: String,
            required: false
        },
        ubicacion: {
            type: String,
            required: false
        },
        icono: {
            type: String,
            required: false
        },
        hora: {
            type: String,
            required: false
        },
        direccion: {
            type: String,
            required: false
        }
    }],
    vestimenta: {
        codigo: {
            type: String,
            required: false
        },
        mensaje: {
            type: String,
            required: false
        }
    },
    ubicacion: [{
        salon: {
            type: String,
            required: false
        },
        foto: {
            type: String,
            required: false
        },
        direccion: {
            type: String,
            required: false
        },
        ciudad: {
            type: String,
            required: false
        },
        link: {
            type: String,
            required: false
        }
    }],
    invitados: [{
        mesa: {
            type: Number,
            required: false
        },
        invitado: {
            type: String,
            required: false
        },
        pase: {
            type: Number,
            required: false
        },
        infantes: {
            type: Number,
            required: false
        },
        telefono: [{
            type: String,
            required: false
        }],
        asistir: {
            type: String,
            required: false
        },
        de: {
            type: String,
            required: false
        }
    }],
    estilos:{
        tituloPortada:{
            type: String,
            required: false
        },
        contenidoPortada:{
            type: String,
            required: false
        },
        alineamientoMensaje:{
            type: String,
            required: false
        },
        letraMensaje:{
            type: String,
            required: false
        },
        letraPase:{
            type: String,
            required: false
        },
        letraUbicacion:{
            type: String,
            required: false
        },
        colorPadit:{
            type: String,
            required: false
        },
        colorMesa:{
            type: String,
            required: false
        },
        colorPadres:{
            type: String,
            required: false
        },
        colorConfirmacion: {
            type: String,
            required: false
        },
        modo: {
            type: String,
            required: false
        },
        contenidoPadres: {
            type: String,
            required: false
        },
        estilosVestimenta: {
            fondo:{
                type: String,
                required: false
            },
            color:{
                type: String,
                required: false
            }, 
            modo:{
                type: String,
                required: false
            }
        },
        estilosInvitacion:{
            fondo:{
                type: String,
                required: false
            },
            color:{
                type: String,
                required: false
            }
        },
        estilosGaleria:{
            fondo:{
                type: String,
                required: false
            },
            color:{
                type: String,
                required: false
            }
        }
    },
    mensajeUno:{
        icono:{
            url: {
                type: String,
                require: false
            },
            public_id: {
                type: String,
                require: false
            }  
        },
        adorno:{
            url: {
                type: String,
                require: false
            },
            public_id: {
                type: String,
                require: false
            }
        },
        mensaje:{
            type: String,
            require: false
        },
        alineamiento:{
            type: String,
            require: false 
        },
        color:{
            type: String,
            require: false
        }
    },
    confirmaciones:{
        mensajeUno:{
            type: Boolean,
            required: false
        },
        frases:{
            type: Boolean,
            required: false
        },
        lluvia:{
            type: Boolean,
            required: false
        },
        condiciones:{
            type: Boolean,
            required: false
        }
    },
    frase3: {
        img:{
            type: String,
            required: false
        },
        frase:{
            type: String,
            required: false
        }
    }

});

module.exports = mongoose.model('eventos', EventoSchema);