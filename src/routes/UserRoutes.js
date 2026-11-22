
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários da Digital Store
 */

/**
 * @swagger
 * /v1/user:
 *   post:
 *     summary: Cadastrar usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Usuário cadastrado
 *       400:
 *         description: Dados inválidos
 */
router.post('/user', (req, res) => {
    userController.create(req, res);
});

/**
 * @swagger
 * /v1/user/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/user/:id', auth, (req, res) => {
    userController.findById(req, res);
});

/**
 * @swagger
 * /v1/user/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Usuários]
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
 *               firstname:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/user/:id', auth, (req, res) => {
    userController.update(req, res);
});

/**
 * @swagger
 * /v1/user/{id}:
 *   delete:
 *     summary: Excluir usuário
 *     tags: [Usuários]
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
 *         description: Usuário excluído
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/user/:id', auth, (req, res) => {
    userController.delete(req, res);
});

module.exports = router;
