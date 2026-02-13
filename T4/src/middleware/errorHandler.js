export default function errorHandler(err, req, res, next) {
    console.error(err)

    if(err.name==='ZodError'){
        return res.status(400).json({
        error: 'Error de validación',
        details:err.issues
    })
}

res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
})
}


