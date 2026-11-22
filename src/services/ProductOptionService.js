const { Product, ProductOption } = require('../models');

class ProductOptionService {
    async create(productId, data) {
        const {
            title, 
            shape,
            radius,
            type,
            values
        } = data;

        if (!title || !values) {
            throw new Error('Título e valores são obrigatórios.');
        }

        const product = await Product.findByPk(productId);

        if(!product) {
            throw new Error('Produto não encontrado.');
        }

        const option = await ProductOption.create({
            product_id: productId,
            title,
            shape: shape ?? 'square',
            radius: radius ?? 0,
            type: type ?? 'text',
            values
        });

        return option;
    }

    async findByProduct(productId) {
        const product = await Product.findByPk(productId);

        if (!product) {
            return null;
        }

        return await ProductOption.findAll({
            where: {
                product_id: productId
            }
        });
    }

    async delete(id) {
        const option = await ProductOption.findByPk(id);

        if (!option) {
            return false;
        }

        await option.destroy();

        return true;
    }
}

module.exports = new ProductOptionService();