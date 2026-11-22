const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({
            message: 'Token não informado.'
        });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Formato de autenticação inválido.'
        });
    }

    const token = authHeader.slice(7);

    if (!token) {
        return res.status(401).json({
            message: 'Token inválido.'
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ['HS256'] }
        );

        const user = await User.findByPk(decoded.id, {
            attributes: ['id']
        });

        if (!user) {
            return res.status(401).json({
                message: 'Usuário não encontrado ou não autorizado.'
            });
        }

        req.userId = user.id;

        return next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' ||
            error.name === 'TokenExpiredError' ||
            error.name === 'NotBeforeError') {
            return res.status(401).json({
                message: 'Token inválido ou expirado.'
            });
        }

        console.error('Erro na autenticação:', error);

        return res.status(500).json({
            message: 'Erro interno na autenticação.'
        });
    }
};

module.exports = auth;