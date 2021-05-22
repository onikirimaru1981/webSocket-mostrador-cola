// Referencias HTML
const lblEscritorio = document.querySelector('h1');// Recordatorio,querySelector,si hubiera mas de un h1 seleccionaria el primero que hay
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');
const socket = io();

// Codigo para leer la url,compatible con navegadores,Chrome,Firefox (Gecko),Opera,Safari
const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {

    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
};

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = 'Escritorio ' + escritorio;
divAlerta.style.display = 'none';

socket.on('connect', () => {
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    btnAtender.disabled = true;

});


socket.on('tickets-pendientes', (pendientes) => {

    if (pendientes === 0) {
        lblPendientes.style.display = 'none';
    } else {
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes;
    };

});


btnAtender.addEventListener('click', () => {

    socket.emit('atender-ticket', { escritorio }, ({ ok, ticket, msg }) => {// Tener en cuenta en el controller que estamos mandando un objeto

        // Cualquier error que aparezca sera capturado por este condicional
        if (!ok) {
            lblTicket.innerText = 'Nadie.';
            return divAlerta.style.display = '';
        };
        if (ok) {

            divAlerta.style.display = 'none';
        };

        lblTicket.innerText = `Ticket: ${ticket.numero}`;

    });

});