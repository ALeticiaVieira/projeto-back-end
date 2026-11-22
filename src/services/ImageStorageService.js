const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

class ImageStorageService {
    async save(base64, type, productId) {
        const allowedTypes = {
            'image/png': 'png',
            'image/jpeg': 'jpg'
        };

        if (!allowedTypes[type]) {
            throw new Error('Formato de imagem não permitido.');
        }

        if (!base64 || typeof base64 !== 'string') {
            throw new Error('Conteúdo da imagem inválido.');
        }

        const content = base64.replace(
            /^data:image\/(png|jpeg);base64,/,
            ''
        );

        const buffer = Buffer.from(content, 'base64');

        if (
            !buffer.length ||
            buffer.toString('base64') !== content.replace(/\s/g, '')
        ) {
            throw new Error('Imagem Base64 inválida.');
        }

        const filename = `${crypto.randomUUID()}.${allowedTypes[type]}`;

        const directory = path.join(
            __dirname,
            '../../public/images/products',
            String(productId)
        );

        await fs.mkdir(directory, { recursive: true });

        await fs.writeFile(path.join(directory, filename), buffer);

        return `/public/images/products/${productId}/${filename}`;
    }

    async delete(imagePath) {
        if (
            typeof imagePath !== 'string' ||
            !imagePath.startsWith('/public/images/products/')
        ) {
            throw new Error('Caminho de imagem inválido.');
        }

        const root = path.resolve(
            __dirname,
            '../../public/images/products'
        );

        const filePath = path.resolve(
            __dirname,
            `../..${imagePath}`
        );

        if (!filePath.startsWith(root + path.sep)) {
            throw new Error('Caminho de imagem inválido.');
        }

        await fs.unlink(filePath);
    }
}

module.exports = new ImageStorageService();
