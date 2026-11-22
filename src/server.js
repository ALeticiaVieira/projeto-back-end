const app = require ('./app');
const database = require('./config/database');

const port = process.env.PORT || 3000;

database.authenticate()
    .then(() => {
        console.log('Conexão com MySQL estabelecida com sucesso!');

        app.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao conectar com o banco:', error)
    });
