const express = require('express');
const app = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const exceljs = require('exceljs');

const { checkSignIn } = require('../middleware/auth');

dotenv.config();

app.use(fileUpload());

app.post('/create', async (req, res) => {
    try {
        await prisma.product.create({
            data: req.body,
        });

        res.send({ message: 'success' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.get('/list', async (req, res) => {
    await prisma.product
        .findMany({
            orderBy: {
                id: 'desc',
            },
            where: {
                status: 'use',
            },
        })
        .then((results) => res.send({ results: results }))
        .catch((e) => res.status(500).send({ error: e.message }));
});

app.get('/listTrash', checkSignIn, async (req, res) => {
    await prisma.product
        .findMany({
            orderBy: {
                id: 'desc',
            },
            where: {
                status: 'delete',
            },
        })
        .then((results) => res.send({ results: results }))
        .catch((e) => res.status(500).send({ error: e.message }));
});

app.delete('/remove/:id', checkSignIn, async (req, res) => {
    await prisma.product
        .update({
            data: {
                status: 'delete',
            },
            where: {
                id: parseInt(req.params.id),
            },
        })
        .then(res.send({ message: 'success' }))
        .catch((e) => res.status(500).send({ error: e.message }));
});

app.delete('/restore/:id', checkSignIn, async (req, res) => {
    await prisma.product
        .update({
            data: {
                status: 'use',
            },
            where: {
                id: parseInt(req.params.id),
            },
        })
        .then(res.send({ message: 'success' }))
        .catch((e) => res.status(500).send({ error: e.message }));
});

app.put('/update', checkSignIn, async (req, res) => {
    const fs = require('fs');
    await prisma.product
        .findFirst({
            where: {
                id: parseInt(req.body.id),
            },
            select: {
                img: true,
            },
        })
        .then(async (res) => {
            // old img name
            if (fs.existsSync('./uploads/' + res.img && res.img !== '')) {
                await fs.unlinkSync('./uploads/' + res.img);
            }
        })
        .catch((e) => res.status(500).send({ error: e.message }));
    await prisma.product
        .update({
            data: req.body,
            where: {
                id: parseInt(req.body.id),
            },
        })
        .then(res.send({ message: 'success' }))
        .catch((e) => res.status(500).send({ error: e.message }));
});

app.post('/upload', checkSignIn, async (req, res) => {
    try {
        if (req.files !== undefined) {
            if (req.files.img !== undefined) {
                const img = req.files.img;
                const fs = require('fs');
                const myDate = new Date();
                const y = myDate.getFullYear();
                const m = myDate.getMonth() + 1;
                const d = myDate.getDate();
                const h = myDate.getHours();
                const mi = myDate.getMinutes();
                const s = myDate.getSeconds();
                const ms = myDate.getMilliseconds();

                const arrFileName = img.name.split('.');
                const ext = arrFileName[arrFileName.length - 1];

                const newName = `${y}${m}${d}${h}${mi}${s}${ms}.${ext}`;

                img.mv('./uploads/' + newName, (err) => {
                    if (err) throw err;
                    res.send({ newName: newName });
                });
            }
        } else {
            res.status(501).send('not implemented');
        }
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.post('/uploadFromExcel', checkSignIn, async (req, res) => {
    try {
        const fileExcel = req.files.fileExcel;

        if (fileExcel !== undefined || fileExcel !== null) {
            fileExcel.mv('./uploads/' + fileExcel.name, async (err) => {
                if (err) throw err;

                const workbook = new exceljs.Workbook();
                await workbook.xlsx.readFile('./uploads/' + fileExcel.name);

                const ws = workbook.getWorksheet(1);
                for (let i = 2; i <= ws.rowCount; i++) {
                    const name = ws.getRow(i).getCell(1).value ?? '';
                    const cost = ws.getRow(i).getCell(2).value ?? 0;
                    const price = ws.getRow(i).getCell(3).value ?? 0;
                    if (name !== '' && cost >= 0 && price >= 0) {
                        await prisma.product.create({
                            data: {
                                name: name,
                                cost: cost,
                                price: price,
                                img: '',
                            },
                        });
                    }
                }
                const fs = require('fs');
                await fs.unlinkSync('./uploads/' + fileExcel.name);
                res.send({ message: 'success' });
            });
        } else {
            res.status(500).send({ message: 'fileExcel is null or undefined' });
        }
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
    // res.send({message: 'success'})
    // await prisma.product.update({
    //     data: req.body,
    //     where: {
    //         id: parseInt(req.body.id)
    //     }
    // })
    //     .then(res.send({message: 'success'}))
    //     .catch((e) => res.status(500).send({error: e.message}))
});

module.exports = app;
