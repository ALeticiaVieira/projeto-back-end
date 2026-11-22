const imageStorageService = require('./ImageStorageService');

const {
    Product,
    Category,
    ProductImage,
    ProductOption
} = require('../models');

const {
    Op,
    fn,
    col,
    where: sequelizeWhere
} = require('sequelize');

class ProductService {
    async create(data) {
        const {
            name,
            slug,
            enabled,
            use_in_menu,
            stock,
            description,
            price,
            price_with_discount,
            category_ids,
            images,
            options
        } = data;

        if (
            !name ||
            !slug ||
            price === undefined ||
            price === null ||
            price_with_discount === undefined ||
            price_with_discount === null
        ) {
            throw new Error('Os campos obrigatórios não foram preenchidos.');
        }

        const existingProduct = await Product.findOne({
            where: { slug }
        });

        if (existingProduct) {
            throw new Error('Este produto já está cadastrado.');
        }

        let categories = [];

        if (category_ids !== undefined) {
            if (!Array.isArray(category_ids)) {
                throw new Error('category_ids deve ser uma lista de IDs.');
            }

            categories = await Category.findAll({
                where: { id: category_ids }
            });

            if (categories.length !== new Set(category_ids).size) {
                throw new Error('Uma ou mais categorias não foram encontradas.');
            }
        }

        const product = await Product.create({
            name,
            slug,
            enabled: enabled ?? false,
            use_in_menu: use_in_menu ?? false,
            stock: stock ?? 0,
            description: description ?? null,
            price,
            price_with_discount
        });

        if (categories.length > 0) {
            await product.setCategories(categories);
        }

        if (images !== undefined) {
            if (!Array.isArray(images)) {
                throw new Error('As imagens devem ser enviadas em uma lista.');
            }

            for (const image of images) {
                if (!image.content || !image.type) {
                    throw new Error('Dados da imagem inválidos.');
                }

                const imagePath = await imageStorageService.save(
                    image.content,
                    image.type,
                    product.id
                );

                await ProductImage.create({
                    product_id: product.id,
                    path: imagePath,
                    enabled: true
                });
            }
        }

        if (options !== undefined) {
            if (!Array.isArray(options)) {
                throw new Error('As opções devem ser enviadas em uma lista.');
            }

            for (const option of options) {
                await this.createOption(product.id, option);
            }
        }

        return product;
    }

    async createOption(productId, option) {
        const values = option.values ?? option.value;

        if (
            !option.title ||
            !Array.isArray(values) ||
            values.length === 0 ||
            values.some(value => typeof value !== 'string' || !value.trim())
        ) {
            throw new Error('Os dados da opção são inválidos.');
        }

        const radius = option.radius === undefined
            ? 0
            : parseInt(option.radius, 10);

        if (!Number.isInteger(radius) || radius < 0) {
            throw new Error('O raio da opção é inválido.');
        }

        const shape = option.shape ?? 'square';
        const type = option.type ?? 'text';

        if (!['square', 'circle'].includes(shape)) {
            throw new Error('Formato da opção inválido.');
        }

        if (!['text', 'color'].includes(type)) {
            throw new Error('Tipo da opção inválido.');
        }

        return await ProductOption.create({
            product_id: productId,
            title: option.title,
            shape,
            radius,
            type,
            values: values.join(', ')
        });
    }

    async search(query) {
        const {
            limit = 12,
            page = 1,
            fields,
            match,
            category_ids,
            'price-range': priceRange
        } = query;

        const parsedLimit = Number(limit);
        const parsedPage = Number(page);

        if (
            (parsedLimit !== -1 &&
                (!Number.isInteger(parsedLimit) || parsedLimit <= 0)) ||
            !Number.isInteger(parsedPage) ||
            parsedPage < 1
        ) {
            throw new Error('Parâmetros de paginação inválidos.');
        }

        const where = {};

        if (match) {
            where[Op.or] = [
                { name: { [Op.like]: `%${match}%` } },
                { description: { [Op.like]: `%${match}%` } }
            ];
        }

        if (priceRange) {
            const prices = priceRange.split('-').map(Number);

            if (
                prices.length !== 2 ||
                prices.some(price => !Number.isFinite(price)) ||
                prices[0] < 0 ||
                prices[1] < prices[0]
            ) {
                throw new Error('Faixa de preço inválida.');
            }

            where.price = {
                [Op.between]: prices
            };
        }

        let categoryIds = null;

        if (category_ids) {
            categoryIds = category_ids.split(',').map(Number);

            if (
                categoryIds.some(id => !Number.isInteger(id) || id <= 0)
            ) {
                throw new Error('IDs de categorias inválidos.');
            }
        }

        const optionFilters = [];

        for (const [key, value] of Object.entries(query)) {
            const optionMatch = key.match(/^option\[(\d+)\]$/);

            if (optionMatch) {
                const optionId = Number(optionMatch[1]);

                if (!value || !Number.isInteger(optionId) || optionId <= 0) {
                    throw new Error('Filtro de opção inválido.');
                }

                const values = value.split(',').map(item => item.trim());

                if (values.some(item => !item)) {
                    throw new Error('Valores de opção inválidos.');
                }

                optionFilters.push({
                    id: optionId,
                    values
                });
            }
        }

        const allowedFields = [
            'enabled',
            'name',
            'slug',
            'use_in_menu',
            'stock',
            'description',
            'price',
            'price_with_discount',
            'images',
            'options',
            'categories'
        ];

        let requestedFields = null;
        let attributes;

        if (fields) {
            requestedFields = fields.split(',').map(field => field.trim());

            if (
                requestedFields.some(field => !field) ||
                requestedFields.some(field => !allowedFields.includes(field))
            ) {
                throw new Error('Campos de busca inválidos.');
            }

            attributes = [
                'id',
                ...requestedFields.filter(field =>
                    !['images', 'options', 'categories'].includes(field)
                )
            ];
        }

        const include = [];

        if (
            !fields ||
            requestedFields.includes('categories') ||
            categoryIds
        ) {
            include.push({
                model: Category,
                as: 'categories',
                ...(fields && !requestedFields.includes('categories')
                    ? { attributes: [] }
                    : {}),
                through: {
                    attributes: []
                },
                ...(categoryIds ? {
                    where: {
                        id: {
                            [Op.in]: categoryIds
                        }
                    },
                    required: true
                } : {})
            });
        }

        if (!fields || requestedFields.includes('images')) {
            include.push({
                model: ProductImage,
                as: 'images'
            });
        }

        if (
            !fields ||
            requestedFields.includes('options') ||
            optionFilters.length > 0
        ) {
            include.push({
                model: ProductOption,
                as: 'options',
                ...(fields && !requestedFields.includes('options')
                    ? { attributes: [] }
                    : {}),
                ...(optionFilters.length > 0 ? {
                    where: {
                        [Op.or]: optionFilters.map(filter => ({
                            [Op.and]: [
                                { id: filter.id },
                                {
                                    [Op.or]: filter.values.map(value =>
                                        sequelizeWhere(
                                            fn(
                                                'FIND_IN_SET',
                                                value,
                                                fn(
                                                    'REPLACE',
                                                    col('options.values'),
                                                    ', ',
                                                    ','
                                                )
                                            ),
                                            { [Op.gt]: 0 }
                                        )
                                    )
                                }
                            ]
                        }))
                    },
                    required: true
                } : {})
            });
        }

        const searchOptions = {
            where,
            include,
            attributes,
            distinct: true,
            order: [['id', 'ASC']]
        };

        if (parsedLimit === -1) {
            const result = await Product.findAndCountAll(searchOptions);

            return {
                data: result.rows,
                total: result.count,
                limit: -1,
                page: 1
            };
        }

        const result = await Product.findAndCountAll({
            ...searchOptions,
            limit: parsedLimit,
            offset: (parsedPage - 1) * parsedLimit
        });

        return {
            data: result.rows,
            total: result.count,
            limit: parsedLimit,
            page: parsedPage
        };
    }

    async findAll() {
        return await Product.findAll({
            include: [
                {
                    model: Category,
                    as: 'categories',
                    through: { attributes: [] }
                },
                {
                    model: ProductImage,
                    as: 'images'
                },
                {
                    model: ProductOption,
                    as: 'options'
                }
            ]
        });
    }

    async findById(id) {
        return await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'categories',
                    through: { attributes: [] }
                },
                {
                    model: ProductImage,
                    as: 'images'
                },
                {
                    model: ProductOption,
                    as: 'options'
                }
            ]
        });
    }

    async update(id, data) {
        const product = await Product.findByPk(id);

        if (!product) {
            return null;
        }

        const {
            name,
            slug,
            enabled,
            use_in_menu,
            stock,
            description,
            price,
            price_with_discount,
            category_ids,
            images,
            options
        } = data;

        if (slug && slug !== product.slug) {
            const existingProduct = await Product.findOne({
                where: {
                    slug,
                    id: { [Op.ne]: id }
                }
            });

            if (existingProduct) {
                throw new Error('Este slug já está sendo utilizado.');
            }
        }

        if (category_ids !== undefined) {
            if (!Array.isArray(category_ids)) {
                throw new Error('category_ids deve ser uma lista de IDs.');
            }

            const categories = await Category.findAll({
                where: { id: category_ids }
            });

            if (categories.length !== new Set(category_ids).size) {
                throw new Error('Uma ou mais categorias não foram encontradas.');
            }

            await product.setCategories(categories);
        }

        await product.update({
            name: name ?? product.name,
            slug: slug ?? product.slug,
            enabled: enabled ?? product.enabled,
            use_in_menu: use_in_menu ?? product.use_in_menu,
            stock: stock ?? product.stock,
            description: description ?? product.description,
            price: price ?? product.price,
            price_with_discount:
                price_with_discount ?? product.price_with_discount
        });

        if (images !== undefined) {
            if (!Array.isArray(images)) {
                throw new Error('As imagens devem ser enviadas em uma lista.');
            }

            for (const image of images) {
                if (image.deleted === true) {
                    if (!image.id) {
                        throw new Error('ID da imagem não informado.');
                    }

                    const existingImage = await ProductImage.findOne({
                        where: {
                            id: image.id,
                            product_id: product.id
                        }
                    });

                    if (!existingImage) {
                        throw new Error('Imagem não encontrada neste produto.');
                    }

                    await existingImage.destroy();
                    continue;
                }

                if (image.id) {
                    const existingImage = await ProductImage.findOne({
                        where: {
                            id: image.id,
                            product_id: product.id
                        }
                    });

                    if (!existingImage) {
                        throw new Error('Imagem não encontrada neste produto.');
                    }

                    if (
                        image.content &&
                        !/^https?:\/\//i.test(image.content)
                    ) {
                        if (!image.type) {
                            throw new Error('Tipo da imagem não informado.');
                        }

                        const imagePath = await imageStorageService.save(
                            image.content,
                            image.type,
                            product.id
                        );

                        await existingImage.update({
                            path: imagePath
                        });
                    }

                    continue;
                }

                if (image.content && image.type) {
                    const imagePath = await imageStorageService.save(
                        image.content,
                        image.type,
                        product.id
                    );

                    await ProductImage.create({
                        product_id: product.id,
                        path: imagePath,
                        enabled: true
                    });
                } else {
                    throw new Error('Dados da nova imagem inválidos.');
                }
            }
        }

        if (options !== undefined) {
            if (!Array.isArray(options)) {
                throw new Error('As opções devem ser enviadas em uma lista.');
            }

            for (const option of options) {
                if (option.deleted === true) {
                    if (!option.id) {
                        throw new Error('ID da opção não informado.');
                    }

                    const existingOption = await ProductOption.findOne({
                        where: {
                            id: option.id,
                            product_id: product.id
                        }
                    });

                    if (!existingOption) {
                        throw new Error('Opção não encontrada neste produto.');
                    }

                    await existingOption.destroy();
                    continue;
                }

                if (option.id) {
                    const existingOption = await ProductOption.findOne({
                        where: {
                            id: option.id,
                            product_id: product.id
                        }
                    });

                    if (!existingOption) {
                        throw new Error('Opção não encontrada neste produto.');
                    }

                    const values = option.values ?? option.value;

                    const radius = option.radius === undefined
                        ? existingOption.radius
                        : parseInt(option.radius, 10);

                    if (!Number.isInteger(radius) || radius < 0) {
                        throw new Error('O raio da opção é inválido.');
                    }

                    if (
                        values !== undefined &&
                        (!Array.isArray(values) ||
                            values.length === 0 ||
                            values.some(value =>
                                typeof value !== 'string' || !value.trim()
                            ))
                    ) {
                        throw new Error('Valores da opção inválidos.');
                    }

                    const shape = option.shape ?? existingOption.shape;
                    const type = option.type ?? existingOption.type;

                    if (!['square', 'circle'].includes(shape)) {
                        throw new Error('Formato da opção inválido.');
                    }

                    if (!['text', 'color'].includes(type)) {
                        throw new Error('Tipo da opção inválido.');
                    }

                    await existingOption.update({
                        title: option.title ?? existingOption.title,
                        shape,
                        radius,
                        type,
                        values: values
                            ? values.join(', ')
                            : existingOption.values
                    });

                    continue;
                }

                await this.createOption(product.id, option);
            }
        }

        return await this.findById(product.id);
    }

    async delete(id) {
        const product = await Product.findByPk(id);

        if (!product) {
            return false;
        }

        await product.destroy();

        return true;
    }
}

module.exports = new ProductService();
