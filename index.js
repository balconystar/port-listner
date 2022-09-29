const { SerialPort , DelimiterParser} = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const parser = new ReadlineParser()
const net = require('net'); 
const host = "127.0.0.1";
const port = 9000;
var dataUniversal = {};
const server = net.createServer(); 

let { HoribaPentra60Reader, HoribaPentra60Parser } = require('node-astm');

  let machine = new HoribaPentra60Reader();

// Create a port
// const myPort = new SerialPort({
//     path: 'COM4',
//     baudRate: 9600,
//   })
//   myPort.pipe(parser)


// // let Readline = SerialPort.parsers.Readline; // make instance of Readline parser
// // let parser = new Readline(); // make a new parser to read ASCII lines
// // myPort.pipe(parser); // pipe the serial stream to the parser

// myPort.on('open', showPortOpen);
// parser.on('data', readSerialData);
// myPort.on('close', showPortClose);
// myPort.on('error', showError);

// function showPortOpen(){
//   console.log("The port is opened");
// }

// function readSerialData(data){
//   console.log(data);
//   //myPort.write(process.argv[2]);
// }
// function showPortClose(){
//   console.log("The port was closed");
// }
// function showError(error){
//   console.log(error);
// }
// setTimeout(()=>{
//   myPort.write("12\n",'ascii',(error)=>{
//     //console.log(error);
//   });
// },5000)

server.listen(port, host, () => { 
    console.log(`TCP Client listening on ${host}:${port}`); 
}); 


let sockets = []; 
server.on('connection', (socket) => { 
    var clientAddress = `${socket.remoteAddress}:${socket.remotePort}`; 
    console.log(`new client connected: ${clientAddress}`); 
    
    sockets.push(socket); 
    // console.log(sockets);
   
    socket.once('data', (data) => {
        console.log(`Client ${clientAddress}: ${data}`); 
        const crypto = require('crypto');
        const buf = crypto.randomBytes(256);
        //console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);   
                
        //Write the data back to all the connected, the client will receive it as data from the server 
        sockets.forEach((sock) => { 
            // var arr = [user1_pub_pem, buf];
            // sock.write(Buffer.concat(arr));            
        }); 
        dataUniversal =  data;
    });

    // Add a 'close' event handler to this instance of socket 
    socket.on('close', (data) => { 
        let index = sockets.findIndex((o) => { 
            return o.remoteAddress === socket.remoteAddress && o.remotePort === socket.remotePort; 
        })

        if (index !== -1) sockets.splice(index, 1); 

        sockets.forEach((sock) => { 
            sock.write(`${clientAddress} disconnected\n`); 
        });

        console.log(`connection closed: ${clientAddress}`); 
    });

    // Add a 'error' event handler to this instance of socket 
    socket.on('error', (err) => { 
        console.log(`Error occurred in ${clientAddress}: ${err.message}`); 
    });
}); 
const express = require('express')
const app = express()
const port2 = 8000;

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send(dataUniversal);
})
app.listen(port2, () => {
    console.log(`Example app listening on port ${port2}`)
  })

  
  
  machine.on('log', (...args) => {
    console.log(...args);
  });
  
  machine.on('error', (error) => {
    console.log(error);
  });
  
  machine.on('parse-error', (error) => {
    console.log(error);
  });
  
  machine.on('data', (transmission) => {
    let string = machine.summarizeTransmission(transmission);
    let parser = new HoribaPentra60Parser();
    let results = parser.parse(string);
    console.log(results); // outputs { testResultList, suspectedPathologyList }
  })
  
  machine.initiate('COM4');