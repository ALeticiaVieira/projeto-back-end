const productService = require('../services/ProductService');

class ProductController {
    async create(req, res) {
        try {
            const product = await   productService.create(req.body);

            return res.status(201).json(product);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async findAll(req, res) {
        try {
            const products = await productService.findAll();

            return res.status(200).json(products);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async findById(req, res) {
        try {
            const product = await productService.findById(req.params.id);

            if (!product) {
                return res.status(404).json({
                    message: 'Produto não encontrado.'
                });
            }

            return res.status(200).json(product);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const product = await productService.update(
                req.params.id,
                req.body
            );

            if (!product) {
                return res.status(404).json({
                    message: 'Produto não encontrado.'
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
            const result = await productService.delete(req.params.id);

            if (!result) {
                return res.status(404).json({
                    message: 'Produto não encontrado.'
                });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async search(req, res) {
        try {
            const products = await productService.search(req.query);

            return res.status(200).json(products);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }
}

module.exports = new ProductController();