const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthService {
    async login(email, password) {
        if (!email || !password) {
            throw new Error('E-mail e senha são obrigatórios.');
        }

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            throw new Error('E-mail ou senha incorretos.');
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            throw new Error('E-mail ou senha incorretos.');
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('Configuração de autenticação indisponível.');
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { 
                expiresIn: process.env.JWT_EXPIRES_IN || '1d',
                algorithm: 'HS256'
            } 
        );

        return {
            id: user.id,
            firstname: user.firstname,
            email: user.email,
            token
        };
    }
}

module.exports = new AuthService();