const path = require('path');// Requiriendo path para obtener path de donde grabar
const fs = require('fs');// Requiriendo fs para guardar en carpeta Db

class Ticket {

    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    };
};

class TicketControl {

    constructor() {// Declarando propiedades
        this.ultimo = 0;
        this.hoy = new Date().getDate();// Sacar dia
        this.tickets = [];
        this.ultimos4 = [];
        this.init()// Llamada de init para cuando establezca todas las propiedades se inicie
    };

    get toJson() {// Codigo para obtener un return con las propiedades grabadas,la idea de este get es que se mire como una propiedad de la clase
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
        };
    };

    init() {// codigo para cuando se instancie mi clase corra este codigo

        const { hoy, tickets, ultimos4, ultimo } = require('../db/data.json');// Codigo para leer la Db
        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;

        } else {
            this.guardarDb();
        };
    };

    guardarDb() {

        const dbPath = path.join(__dirname, '../db/data.json');// Path en donde grabar informacion
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));// Codigo para grabar archivo y tranformar el objeto en su equivalente a un json
    };

    siguiente() {

        this.ultimo += 1;// Acumulador
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.guardarDb();
        return 'Ticket: ' + ticket.numero;
    };

    atenderTicket(escritorio) {
        // No tenemos tickets
        console.log(this.tickets);

        if (this.tickets.length === 0) {// Validacion tickets
            return null;
        };

        // const ticket = this.tickets[0];
        // this.tickets.shift();
        const ticket = this.tickets.shift();//this.tickets[0];

        ticket.escritorio = escritorio;
        this.ultimos4.unshift(ticket);


        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1);// Cuando la condicion se cumple empieza por la ultima posicion y corta 1 valor del areglo

        };

        this.guardarDb()
        return ticket;
    };
};


module.exports = TicketControl;

