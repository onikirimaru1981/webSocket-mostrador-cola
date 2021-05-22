const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {
    // Cuando un cliente se conecta se disparan los eventos
    socket.emit('ultimo-ticket', ticketControl.ultimo);// Emitiendo al cliente ultimo ticket
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    //Escuchando del cliente siguiente ticket
    socket.on('siguiente-ticket', (payload, callback) => {// Aunque en este caso el usuario no utilizara el payload,el callback en cambio si que se requiere

        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    });

    socket.on('atender-ticket', ({ escritorio }, callback) => {// Recibimos el objeto del escritorio

        if (!escritorio) {

            return callback({ ok: false, msg: 'El escritorio es obligatorio' });
        };

        const ticket = ticketControl.atenderTicket(escritorio);// Definiendo ticket a atender,teniendo en cuenta que ya tenemos nuestro escritorio
        socket.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);

        if (!ticket) {
            callback({ ok: false, msg: 'Ya no hay tickets pendientes' });

        } else { callback({ ok: true, ticket }); };

    });

};

module.exports = {

    socketController
};

