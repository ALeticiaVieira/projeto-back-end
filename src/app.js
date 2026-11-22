const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const productOptionRoutes = require('./routes/ProductOptionRoutes');
const productImageRoutes = require('./routes/ProductImageRoutes');
const productRoutes = require('./routes/ProductRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const authRoutes = require('./routes/AuthRoutes');
const express = require('express');
const path = require('path');

const app = express();

const userRoutes = require('./routes/UserRoutes');

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/public', express.static('public'));

app.use('/images', express.static(
    path.join(__dirname, '../public/images')
));

app.use('/v1', userRoutes);
app.use('/v1', authRoutes);
app.use('/v1', categoryRoutes);
app.use('/v1', productRoutes);
app.use('/v1', productImageRoutes);
app.use('/v1', productOptionRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        mensagem: 'API Digital Store funcionando!'
    });
});

module.exports = app;