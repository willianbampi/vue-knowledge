module.exports = app => {

    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {

        const category = {
            id: req.body.id,
            name: req.body.name,
            parentId: req.body.parentId
        }
        
        try {
            existsOrError(category.name, 'Nome da categoria não informado!')
        } catch (error) {
            return res.status(400).send(error)
        }
        
        category.id = req.params.id
        
        if(category.id) {
            app.db('categories')
                .update(category)
                .where({id: category.id})
                .then(_ => res.status(204).send())
                .catch(error => res.status(500).send(error))
        } else {
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(error => res.status(500).send(error))
        }

    }

    const remove = async (req, res) => {
        
        const categoryId = req.params.id
        
        if(categoryId) {
            try {
                
                existsOrError(categoryId, 'Código da categoria não informado!')
                
                const subCategory = await app.db('categories')
                                                .where({parentId: categoryId})
                notExistsOrError(subCategory, 'Categoria possui sub categorias!')
                
                const articles = await app.db('articles')
                                            .where({categoryId: categoryId})
                notExistsOrError(articles, 'Categoria possui artigos!')

                const rowsDeleted = await app.db('categories')
                                            .where({id: categoryId})
                                            .del()
                existsOrError(rowsDeleted, 'Categoria não encontrada!')

                res.status(204).send()
                
            } catch (error) {
                res.status(400).send(error)
            }
        }

    }

    const withPath = categories => {
        
        const getParent = (categories, parentId) => {
            const parent = categories.filter(category => category.id === parentId)
            return parent.length ? parent[0] : null
        }

        const categoriesWithPath = categories.map(category => {
            
            let path = category.name
            let parent = getParent(categories, category.parentId)

            while(parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }

            return { ...category, path }

        })

        categoriesWithPath.sort((category1, category2) => {
            
            if(category1.path < category2.path) {
                return -1
            }

            if(category1 > category2.path) {
                return 1
            }

            return 0

        })

        return categoriesWithPath

    }

    const recordsPerPage = 10

    const get = async (req, res) => {

        const page = req.query.page || 1
        
        const result = await app.db('categories')
                                .count('id')
                                .first()
        
        const countRecords = parseInt(result.count)

        app.db('categories')
            .limit(recordsPerPage)
            .offset(page * recordsPerPage - recordsPerPage)
            .then(categories => res.json({ data: withPath(categories), countRecords, recordsPerPage }))
            .catch(error => res.status(500).send(error))
    }

    const getById = (req, res) => {
        
        const categoryId = req.params.id

        if(categoryId) {
            app.db('categories')
                .where({id: categoryId})
                .first()
                .then(category => res.json(category))
                .catch(error => res.status(500).send(error))
        }

    }

    const toTree = (categories, tree) => {
        
        if(!tree) {
            tree = categories.filter(category => !category.parentId)
        }

        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })

        return tree

    }

    const getTree = (req, res) => {
        app.db('categories')
            .then(categories => res.json(toTree(withPath(categories))))
            .catch(error => res.status(500).send(error))
    }

    return { save, remove, get, getById, getTree }

}