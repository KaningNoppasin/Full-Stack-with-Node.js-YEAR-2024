const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/hello/:name', (req, res) => {
    res.send('hello ' + req.params.name);
});

app.get('/hi/:name/:age', (req, res) => {
    const name = req.params.name;
    const age = req.params.age;
    res.send(`name = ${name} age = ${age}`);
});

app.post('/hello', (req, res) => {
    res.send(req.body);
});

app.put('/myPut', (req, res) => {
    res.send(req.body);
});

app.put('/updateCustomer/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = req.body;

    res.send({ id: id, data: data});
});

app.delete('/myDelete/:id', (req, res) => {
    res.send(`id = ${req.params.id}`);
})

app.get('/book/list', async (req, res) => {
    const data = await prisma.book.findMany();
    res.send({data: data});
})

app.listen(3001);