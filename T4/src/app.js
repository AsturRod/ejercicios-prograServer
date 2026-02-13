import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import todosRouter from './routes/todos.routes.js'
import logger from './middlewares/logger.js'
import errorHadler from './middlewares/errorHandler.js'
import rateLimit from './middlewares/rateLimit.js'

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(logger)
app.use(rateLimit)
app.use('/api/todos', todosRouter)
app.use(errorHadler)
export default app

