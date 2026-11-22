const bcrypt = require('bcrypt');
const { User } = require('../models');

class UserService {
    async create(data) {
        const { firstname, surname, email, password, confirmPassword } = data;

        if (!firstname || !surname || !email || !password || !confirmPassword) {
            throw new Error('Todos os campos são obrigatórios.');
        }

        if (password !== confirmPassword) {
            throw new Error('As senhas não coincidem.');
        }

        const existingUser = await User.findOne({
            where: {email}
        });

        if (existingUser) {
            throw new Error('Este e-mail já está cadastrado.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstname, 
            surname,
            email,
            password: hashedPassword
        });

        return user;
    }

    async findById(id) {
        const user = await User.findByPk(id, {
            attributes: ['id', 'firstname', 'surname', 'email']
        });

        return user;
    }

    async update(id, data) {
        const { firstname, surname, email } = data;
        
        if (!firstname || !surname || !email) {
            throw new Error('Todos os campos são obrigatórios.');
        }

        const user = await User.findByPk(id);

        if (!user) {
            return null;
        }

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser && existingUser.id !== Number(id)) {
            throw new Error('Este e-mail já está cadastrado.');
        }

        await user.update({
            firstname, 
            surname,
            email
        });

        return user;
    }

    async delete(id) {
        const user = await User.findByPk(id);

        if (!user) {
            return null;
        }

        await user.destroy();

        return true;
    }
}

module.exports = new UserService();