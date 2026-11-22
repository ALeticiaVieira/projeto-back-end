
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();

const productController = require('../controllers/ProductController');

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gerenciamento de produtos da Digital Store
 */

/**
 * @swagger
 * /v1/product:
 *   post:
 *     summary: Cadastrar produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - price
 *               - price_with_discount
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *               use_in_menu:
 *                 type: boolean
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               price_with_discount:
 *                 type: number
 *               category_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                     type:
 *                       type: string
 *                       example: image/png
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     shape:
 *                       type: string
 *                     radius:
 *                       type: integer
 *                     type:
 *                       type: string
 *                     values:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       201:
 *         description: Produto cadastrado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/product', auth, (req, res) => {
    return productController.create(req, res);
});

/**
 * @swagger
 * /v1/product:
 *   get:
 *     summary: Listar todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get('/product', (req, res) => {
    return productController.findAll(req, res);
});

/**
 * @swagger
 * /v1/product/search:
 *   get:
 *     summary: Buscar produtos com filtros
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: match
 *         schema:
 *           type: string
 *         description: Busca por nome ou descrição
 *       - in: query
 *         name: price-range
 *         schema:
 *           type: string
 *         example: 100-500
 *       - in: query
 *         name: category_ids
 *         schema:
 *           type: string
 *         example: 1,2
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         example: name,price,images
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Resultado da busca
 *       400:
 *         description: Parâmetros inválidos
 */
router.get('/product/search', (req, res) => {
    return productController.search(req, res);
});

/**
 * @swagger
 * /v1/product/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get('/product/:id', (req, res) => {
    return productController.findById(req, res);
});

/**
 * @swagger
 * /v1/product/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Dados do produto, categorias, imagens e opções
 *     responses:
 *       200:
 *         description: Produto atualizado
 *       204:
 *         description: Atualização sem conteúdo
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Produto não encontrado
 */
router.put('/product/:id', auth, (req, res) => {
    return productController.update(req, res);
});

/**
 * @swagger
 * /v1/product/{id}:
 *   delete:
 *     summary: Excluir produto
 *     tags: [Produtos]
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
 *         description: Produto excluído
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/product/:id', auth, (req, res) => {
    return productController.delete(req, res);
});

module.exports = router;
