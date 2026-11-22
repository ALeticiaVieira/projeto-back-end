const { Category } = require('../models');

class CategoryService {
    async create(data) {
        const { name, slug, use_in_menu } = data;

        if (!name || !slug) {
            throw new Error('Nome e slug são obrigatórios.');
        }

        const existingCategory = await Category.findOne({
            where: { slug }
        });

        if (existingCategory) {
            throw new Error('Esta categoria já está cadastrada.');
        }

        const category = await Category.create({
            name, 
            slug,
            use_in_menu: use_in_menu ?? false
        });

        return category;
    }

    async findAll(query) {
        const { Op } = require('sequelize');

        const {
            limit = 12,
            page = 1,
            fields,
            use_in_menu
        } = query;

        const parsedLimit = Number(limit);
        const parsedPage = Number(page);

        if (
            (parsedLimit !== -1 && (!Number.isInteger(parsedLimit) || parsedLimit <= 0)) || 
            parsedPage < 1
        ) {
            throw new Error('Parâmetros de paginação inválidos.');
        }

        const where = {};

        if (use_in_menu !== undefined) {
            if (use_in_menu !== 'true' && use_in_menu !== 'false') {
                throw new Error('use_in_menu deve ser true ou false.');
            }

            where.use_in_menu = use_in_menu === true;
        }

        const attributes = fields
            ? ['id', ...fields.split(',').map(field => field.trim())]
            : undefined;
        
        const options = {
            where,
            attributes,
            order: [['id', 'ASC']]
        };
            
        if (parsedLimit === -1) {
            const categories = await Category.findAll(options);

            return {
                data: categories,
                total: categories.length,
                limit: -1,
                page: 1
            };
        }

        const result = await Category.findAndCountAll({
            ...options,
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

    async update(id, data) {
        const category = await Category.findByPk(id);

        if (!category) {
            return null;
        }

        const { name, slug, use_in_menu } = data;

        await category.update({
            name,
            slug, 
            use_in_menu
        });

        return category;
    }

    async delete(id) {
        const category = await Category.findByPk(id);

        if(!category) {
            return false;
        }

        await category.destroy();

        return true;
    }
}

module.exports = new CategoryService();