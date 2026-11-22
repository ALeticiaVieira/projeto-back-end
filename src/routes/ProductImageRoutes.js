
const express = require('express');
const router = express.Router();

const productImageController = require('../controllers/ProductImageController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Imagens
 *   description: Gerenciamento de imagens dos produtos
 */

/**
 * @swagger
 * /v1/product/{productId}/images:
 *   post:
 *     summary: Adicionar imagem ao produto
 *     tags: [Imagens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - path
 *             properties:
 *               path:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Imagem cadastrada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Produto não encontrado
 */
router.post('/product/:productId/images', auth, (req, res) => {
    return productImageController.create(req, res);
});

/**
 * @swagger
 * /v1/product/{productId}/images:
 *   get:
 *     summary: Listar imagens de um produto
 *     tags: [Imagens]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de imagens
 *       404:
 *         description: Produto não encontrado
 */
router.get('/product/:productId/images', (req, res) => {
    return productImageController.findByProduct(req, res);
});

/**
 * @swagger
 * /v1/product-images/{id}:
 *   delete:
 *     summary: Excluir imagem
 *     tags: [Imagens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Imagem excluída
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Imagem não encontrada
 */
router.delete('/product-images/:id', auth, (req, res) => {
    return productImageController.delete(req, res);
});

module.exports = router;
