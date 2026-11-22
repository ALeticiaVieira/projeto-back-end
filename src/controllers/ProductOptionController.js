const productOptionService = require('../services/ProductOptionService');

class ProductOptionController {
    async create(req, res) {
        try {
            const option = await productOptionService.create(
                req.params.productId,
                req.body
            );

            return res.status(201).json(option);
        } catch (error) {
            const status = error.message === 'Produto não encontrado.' ? 404 : 400;

            return res.status(status).json({
                message: error.message
            });
        }
    }

    async findByProduct(req, res) {
        try {
            const options = await productOptionService.findByProduct(
                req.params.productId
            );

            if (options === null) {
                return res.status(404).json({
                    message: 'Produto não encontrado.'
                });
            }

            return res.status(200).json(options);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const result = await productOptionService.delete(req.params.id);

            if (!result) {
                return res.status(404).json({
                    message: 'Opção não encontrada.'
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

module.exports = new ProductOptionController();