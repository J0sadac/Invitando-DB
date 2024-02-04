'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventoSchema = Schema({
    evento: {
        type: String,
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
        }]
    },
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
        explicacion: {
            type: String,
            require: false
        },
        codigo: {
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
        hombre: {
            type: String,
            required: false
        },
        mujer: {
            type: String,
            required: false
        }
    },
    ubicacion: {
        type: String,
        required: false
    },
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
        }
    }]
});

module.exports = mongoose.model('eventos', EventoSchema);