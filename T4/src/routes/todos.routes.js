import { Router } from "express";
import {
    getTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getStats
} from '../controllers/todos.controller.js'

const router = Router()

router.get('/', getTodos)
router.get('/:stats', getStats)
router.get('/:id', getTodoById)
router.post('/', createTodo)
router.put('/:id', updateTodo)
router.delete('/:id', deleteTodo)
router.patch('/:id/toggle', toggleTodo)

export default router