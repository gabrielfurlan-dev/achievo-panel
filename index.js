const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 2001;

app.use(express.json());
app.use(cors(
    {
        origin: [process.env.PROD_URL, process.env.DEV_URL],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        optionsSuccessStatus: 204
    }
));

app.post('/api/send-mail/welcome-user', (req, res) => {
    const { name, email, title, message, key } = req.body;

    if (!name || !email || !key) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (key !== process.env.KEY) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const data = {
        name,
        email,
        title: `${name} sua conta criada com sucesso!`,
        message: `Olá ${name}, sua conta foi criada no Weekly Report com sucesso! Desfrute da ferramenta para gerenciar seus deveres no dia-a-dia.`
    };

    const apiUrl = process.env.WEBHOOK_URL;

    axios
        .post(apiUrl, data)
        .then(response => {
            console.log('Response from the API:', response.data);
            res.status(200).json({ success: true });
        })
        .catch(error => {
            console.error('Error sending data:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.post('/api/send-mail/path-notes', (req, res) => {
    const { name, email, key } = req.body;

    if (!name || !email || !key) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (key !== process.env.KEY) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const data = {
        name,
        email,
        title: `Uma nova atualização!`,
        message: `Fique por dentro das novidades`
    };

    const apiUrl = process.env.WEBHOOK_URL;

    axios
        .post(apiUrl, data)
        .then(response => {
            console.log('Response from the API:', response.data);
            res.status(200).json({ success: true });
        })
        .catch(error => {
            console.error('Error sending data:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});


app.listen(port, () => {
    console.log(`[!] Server is listening on port :: ${port}`);
});
