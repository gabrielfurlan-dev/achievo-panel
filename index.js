const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

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
        message: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bem-vindo ao Weekly Report</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            <style>
                body {
                    background-color: #f2f2f2; /* Cor de fundo do corpo */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh; /* Centraliza verticalmente na tela */
                    margin: 0;
                }
        
                .email-container {
                    background-color: white; /* Cor de fundo do contêiner */
                    border-radius: 5px; /* Cantos arredondados */
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); /* Sombreamento leve */
                    padding: 20px;
                    max-width: 600px; /* Largura máxima do contêiner */
                }
        
                .logo-container {
                    text-align: center;
                }
        
                .logo {
                    max-width: 200px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="logo-container">
                    <img src="https://cdn.discordapp.com/attachments/888859138388549662/1149878503790096455/image_32.png" alt="Logo do Weekly Report" class="logo">
                </div>
                <div class="mt-4">
                    <h2 class="text-center">Bem-vindo ao Weekly Report</h2>
                    <p>Obrigado por se cadastrar em nosso sistema. Estamos empolgados em tê-lo como parte da nossa comunidade.</p>
                    <p>Agora você pode começar a criar suas tarefas e acompanhar seu progresso de forma eficiente.</p>
                    <p>Fique à vontade para explorar todas as funcionalidades do Weekly Report e não hesite em entrar em contato conosco se precisar de ajuda ou tiver alguma dúvida.</p>
                    <p>Esperamos que nossa plataforma seja útil para você e sua equipe. Boa sorte!</p>
                </div>
            </div>
        </body>
        </html>`
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
