module.exports = middleware => {
    return (req, res, next) => {
        
        const isAdmin = req.user.admin
        
        if(isAdmin) {
            middleware(req, res, next)
        } else {
            res.status(401).send('Usuário não possui privilégio de administrador!')
        }
        
    }
}