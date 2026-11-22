const productImageService = require('../services/ProductImageService');

class ProductImageController {
    async create(req, res) {
        try {
            const image = await productImageService.create(
                req.params.productId,
                req.body
            );

            return res.status(201).json(image);
        } catch (error) {
            const status = error.message === 'Produto não encontrado.' ? 404 : 400;

            return res.status(status).json({
                message: error.message
            });
        }
    }

    async findByProduct(req, res) {
        try {
            const images = await productImageService.findByProduct(
                req.params.productId
            );

            if (images === null) {
                return res.status(404).json({
                    message: 'Produto não encontrado.'
                });
            }

            return res.status(200).json(images);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const result = await productImageService.delete(req.params.id);

            if (!result) {
                return res.status(404).json({

                    message: 'Imagem não encontrada.'
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

module.exports = new ProductImageController();