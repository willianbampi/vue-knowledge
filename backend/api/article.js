const queries = require('./queries')

module.exports = app => {

    const { existsOrError } = app.api.validation

    const save = (req, res) => {

        const article = {
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            content: req.body.content,
            userId: req.body.userId,
            categoryId: req.body.categoryId
        }

        const articleId = req.params.id

        try {

            existsOrError(article.name, 'Nome do artigo não informado!')
            existsOrError(article.description, 'Descrição do artigo não informada!')
            existsOrError(article.categoryId, 'Categoria do artigo não informada!')
            existsOrError(article.userId, 'Autor do artigo não informado!')
            existsOrError(article.content, 'Conteúdo do artigo não informado!')

        } catch (error) {
            res.status(400).send(error)
        }

        if(articleId) {
            app.db('articles')
                .update(article)
                .where({id: articleId})
                .then(_ => res.status(204).send())
                .catch(error => res.status(500).send(error))
        } else {
            app.db('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(error => res.status(00).send(error))
        }

    }

    const remove = async (req, res) => {
        
        articleId = req.params.id
        
        if(articleId) {
            try {

                const rowsDeleted = await app.db('articles')
                                            .where({id: articleId})
                                            .del()
                try {
                    existsOrError(rowsDeleted, 'Artigo não encontrado!')
                } catch (error) {
                    return res.status(400).send(error)
                }

                res.status(204).send()

            } catch (error) {
                res.status(500).send(error)
            }

        }

    }

    const recordsPerPage = 10

    const get = async (req, res) => {
        
        const page = req.query.page || 1
        
        const result = await app.db('articles')
                                .count('id')
                                .first()
        
        const countRecords = parseInt(result.count)

        app.db('articles')
            .select('id', 'name', 'description')
            .limit(recordsPerPage)
            .offset(page * recordsPerPage - recordsPerPage)
            .then(articles => res.json({ data: articles, countRecords, recordsPerPage }))
            .catch(error => res.status(500).send(error))
    
    }

    const getById = (req, res) => {
        
        articleId = req.params.id
        
        if(articleId) {
            app.db('articles')
                .where({id: articleId})
                .first()
                .then(article => {
                    article.content = article.content.toString()
                    return res.json(article)
                })
                .catch(error => res.status(500).send(error))
        }
    
    }

    const getByCategory = async (req, res) => {

        const page = req.query.page || 1

        const categoryId = req.params.id

        if(categoryId) {
            const categories = await app.db.raw(queries.categoryWithChildren, categoryId)
            const categoryIds = categories.rows.map(category => category.id)
            app.db({articles: 'articles', users: 'users'})
                .select('articles.id', 'articles.name', 'articles.description', 'articles.imageUrl', {author: 'users.name'})
                .limit(recordsPerPage)
                .offset(page * recordsPerPage - recordsPerPage)
                .whereRaw('?? = ??', ['users.id', 'articles.userId'])
                .whereIn('categoryId', categoryIds)
                .orderBy('articles.id', 'desc')
                .then(articles => res.json(articles))
                .catch(error => res.status(500).send(error))
        }

    }

    return { save, remove, get, getById, getByCategory }

}