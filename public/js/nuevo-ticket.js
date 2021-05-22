
// Referencias HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const botonNuevoTicket = document.querySelector('button');
const socket = io();

// Si mi server no esta conectado no se podra presionar el boton nuevo ticket
socket.on('connect', () => {

    botonNuevoTicket.disabled = false;
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    botonNuevoTicket.disabled = true;
});

socket.on('ultimo-ticket', (ultimo) => {// El nombre que asignemos da igual,pero es recomendable que sea uno orientativo

    lblNuevoTicket.innerText = `Ticket: ${ultimo}`;

});


botonNuevoTicket.addEventListener('click', () => {

    // Emitiendo al servert el siguiente ticket
    socket.emit('siguiente-ticket', null, (ticket) => {// Mandamos null en el payload ya que este no tendra ninguna informacion
        lblNuevoTicket.innerText = ticket;// Codigo para que aparezca en el html el numero de ticket
    });

});