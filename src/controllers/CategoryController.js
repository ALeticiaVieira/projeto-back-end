const categoryService = require('../services/CategoryService');

class CategoryController {
    async create(req, res) {
        try {
            const category = await categoryService.create(req.body);

            return res.status(201).json(category);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async findAll(req, res) {
        try {
            const categories = await categoryService.findAll(req.query);

            return res.status(200).json(categories);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const category = await categoryService.update(
                req.params.id,
                req.body
            );

            if (!category) {
                return res.status(404).json({
                    message: 'Categoria não encontrada.'
                });
            }

            return res.status(200).json(category);
        } catch(error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const result = await categoryService.delete(req.params.id);

            if (!result) {
                return res.status(404).json({
                    message: 'Categoria não encontrada.'
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

module.exports = new CategoryController();