
const express = require('express');
const router = express.Router();

const productOptionController = require('../controllers/ProductOptionController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Opções
 *   description: Gerenciamento de opções dos produtos
 */

/**
 * @swagger
 * /v1/product/{productId}/options:
 *   post:
 *     summary: Adicionar opção ao produto
 *     tags: [Opções]
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
 *               - title
 *               - values
 *             properties:
 *               title:
 *                 type: string
 *                 example: Armazenamento
 *               shape:
 *                 type: string
 *                 example: square
 *               radius:
 *                 type: integer
 *                 example: 0
 *               type:
 *                 type: string
 *                 example: text
 *               values:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [128GB, 256GB, 512GB]
 *     responses:
 *       201:
 *         description: Opção cadastrada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Produto não encontrado
 */
router.post('/product/:productId/options', auth, (req, res) => {
    return productOptionController.create(req, res);
});

/**
 * @swagger
 * /v1/product/{productId}/options:
 *   get:
 *     summary: Listar opções de um produto
 *     tags: [Opções]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de opções
 *       404:
 *         description: Produto não encontrado
 */
router.get('/product/:productId/options', (req, res) => {
    return productOptionController.findByProduct(req, res);
});

/**
 * @swagger
 * /v1/product-options/{id}:
 *   delete:
 *     summary: Excluir opção
 *     tags: [Opções]
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
 *         description: Opção excluída
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Opção não encontrada
 */
router.delete('/product-options/:id', auth, (req, res) => {
    return productOptionController.delete(req, res);
});

module.exports = router;
