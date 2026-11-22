const userService = require('../services/UserService');

class UserController {
    async create(req, res) {
        try {
            const user = await userService.create(req.body);

            return res.status(201).json({
                id: user.id,
                firstname: user.firstname,
                surname: user.surname,
                email: user.email
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async findById(req, res) {
        try {
            if (Number(req.params.id) !== req.userId) {
                return res.status(403).json({
                    message: 'Você não tem permissão para consultar esse usuário.'
                });
            }

            const user = await userService.findById(req.params.id);

            if (!user) {
                return res.status(404).json({
                    message: 'Usuário não encontrado.'
                });
            }

            return res.status(200).json(user);
        } catch(error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async update(req, res) {
        try {

            if (Number(req.params.id) !== req.userId) {
                return res.status(403).json({
                    message: 'Você não tem permissão para alterar esse usuário.'
                })
            }

            const user = await userService.update(req.params.id, req.body);

            if (!user) {
                return res.status(404).json({
                    message: 'Usuário não encontrado.'
                });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async delete(req, res) {
        try {

            if (Number(req.params.id) !== req.userId) {
                return res.status(403).json({
                    message: 'Você não tem permissão para excluir esse usuário.'
                });
            }

            const result = await userService.delete(req.params.id);

            if (!result) {
                return res.status(404).json({
                    message: 'Usuário não encontrado.'
                });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }
}

module.exports = new UserController();