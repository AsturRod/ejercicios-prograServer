import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import todosRouter from './routes/todos.routes.js'
import logger from './middleware/logger.js'
import errorHandler from './middleware/errorHandler.js'
import rateLimit from './middleware/rateLimit.js'

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(logger)
app.use(rateLimit)
app.use('/api/todos', todosRouter)
app.use(errorHandler)

export default app
