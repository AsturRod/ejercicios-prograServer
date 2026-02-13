import app from './app.js'

const PORT = process.env.PORT || 3000

process.on('unandledRejection', err => {
    console.error('Unhandled Rejection:', err)
    process.exit(1)
})

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

