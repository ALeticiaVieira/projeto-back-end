
const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/CategoryController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Gerenciamento de categorias da Digital Store
 */

/**
 * @swagger
 * /v1/category:
 *   post:
 *     summary: Cadastrar categoria
 *     tags: [Categorias]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Eletrônicos
 *               slug:
 *                 type: string
 *                 example: eletronicos
 *               use_in_menu:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Categoria cadastrada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/category', auth, (req, res) => {
    return categoryController.create(req, res);
});

/**
 * @swagger
 * /v1/category/search:
 *   get:
 *     summary: Buscar categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Resultado da busca de categorias
 */
router.get('/category/search', (req, res) => {
    return categoryController.findAll(req, res);
});

/**
 * @swagger
 * /v1/category:
 *   get:
 *     summary: Listar todas as categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get('/category', (req, res) => {
    return categoryController.findAll(req, res);
});

/**
 * @swagger
 * /v1/category/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/category/:id', (req, res) => {
    return categoryController.findById(req, res);
});

/**
 * @swagger
 * /v1/category/{id}:
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Categorias]
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
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               use_in_menu:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Não autorizado
 */
router.put('/category/:id', auth, (req, res) => {
    return categoryController.update(req, res);
});

/**
 * @swagger
 * /v1/category/{id}:
 *   delete:
 *     summary: Excluir categoria
 *     tags: [Categorias]
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
 *         description: Categoria excluída
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Não autorizado
 */
router.delete('/category/:id', auth, (req, res) => {
    return categoryController.delete(req, res);
});

module.exports = router;
