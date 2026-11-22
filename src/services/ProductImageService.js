const { Product, ProductImage } = require('../models');

class ProductImageService {
    async create(productId, data) {
        const { path, enabled } = data;

        if (!path) {
            throw new Error('O caminho da imagem é obrigatório.');
        }

        const product = await Product.findByPk(productId);

        if (!product) {
            throw new Error('Produto não encontrado.');
        }

        const image = await ProductImage.create({
            product_id: productId, 
            path,
            enabled: enabled ?? false
        });

        return image;
    }

    async findByProduct(productId) {
        const product = await Product.findByPk(productId);

        if (!product) {
            return null;
        }

        return await ProductImage.findAll({
            where: {
                product_id: productId
            }
        });
    }

    async delete(id) {
        const image = await ProductImage.findByPk(id);

        if (!image) {
            return false;
        }

        await image.destroy();

        return true;
    }
}

module.exports = new ProductImageService();