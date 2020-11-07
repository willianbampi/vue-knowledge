const bcrypt = require('bcrypt')
const { as } = require('../config/db')

module.exports = app => {

    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
                
        const user = {
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            admin: req.body.admin
        }
        
        user.id = req.params.id

        if(!req.originalUrl.startsWith('/users')) {
            user.admin = false
        }
        
        if(!req.user || !req.user.admin) {
            user.admin = false
        }

        try {

            existsOrError(user.name, 'Nome do usuário não informado!')
            existsOrError(user.email, 'E-mail do usuário não informado!')
            existsOrError(user.password, 'Senha do usuário não informada!')
            existsOrError(user.confirmPassword, 'Confirmação de senha do usuário não informada!')
            equalsOrError(user.password, user.confirmPassword, 'Senha e confirmação de senha não conferem!')
            
            const userFromDB = await app.db('users')
                                        .where({ email: user.email })
                                        .first()
            if(!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado!')
            }

        } catch (error) {
            return res.status(400)
                        .send(error)
        }

        user.password = encryptPassword(user.password)
        
        delete user.confirmPassword
        
        if(user.id){
            app.db('users')
                .update(user)
                .where({id: user.id})
                .whereNull('deletedAt')
                .then(_ => res.status(204).send())
                .catch(error => res.status(500).send(error))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(error => res.status(500).send(error))
        }

    }

    const recordsPerPage = 10

    const get = async (req, res) => {

        const page = req.query.page || 1
        
        const result = await app.db('users')
                                .count('id')
                                .first()
        
        const countRecords = parseInt(result.count)

        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt')
            .limit(recordsPerPage)
            .offset(page * recordsPerPage - recordsPerPage)
            .then(users => res.json({ data: users, countRecords, recordsPerPage }))
            .catch(error => res.status(500).send(error))
    }

    const getById = (req, res) => {
        
        const userId = req.params.id
        
        if(userId) {
            app.db('users')
                .select('id', 'name', 'email', 'admin')
                .where({id : user.id})
                .whereNull('deletedAt')
                .first()
                .then(user => res.json(user))
                .catch(error => res.status(500).send(error))
        }
        
    }

    const remove = async (req, res) => {

        const userId = req.params.id

        if(userId) {
            try{
                const articles = await app.db('articles')
                                            .where({userId: userId})
                notExistsOrError(articles, 'Usuário possui artigos vinculados!')

                const rowsUpdate = await app.db('users')
                                            .update({deletedAt: new Date()})
                                            .where({id: userId})
                existsOrError(rowsUpdate, 'Usuário não foi encontrado')

                res.status(204).send()
            } catch (error) {
                res.status(400).send(error)
            }
        }

    }
    
    return { save, get, getById, remove }
    
}