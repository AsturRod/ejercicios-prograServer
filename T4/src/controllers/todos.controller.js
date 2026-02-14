import {randomUUID} from 'crypto';
import {todos} from '../data/store.js';
import {createTodoSchema, updateTodoSchema} from '../schemas/todo.schema.js';


export const getTodos = (req, res) => {
    let result = [...todos]

        const {completed, priority, tag, sortyBy, order = 'asc', search} = req.query

        if(completed!== undefined) {
            result = result.filter(todo => todo.completed === (completed === 'true'))
        }

        if(priority) {
            result = result.filter(todo => todo.priority === priority)
        }

        if(tag) {
            result = result.filter(t=>t.tags?.includes(tag))
        }
    
        if(search) {
            result = result.filter(t=>t.title.toLowerCase().includes(search.tolowerCase()))
        }

        if(sortyBy) {
            result.sort((a,b) => {
                if(!a[sortyBy] || !b[sortyBy]) return 0
                if(order === 'desc'){
                    return a[sortyBy] > b[sortyBy] ? -1 : 1
                }
                return a[sortyBy] < b[sortyBy] ? -1 : 1
            })
        }
    res.json(result)
}

export const getTodoById = (req, res) => {
    const todo = todos.find(t => t.id === req.params.id)
    if(!todo) return res.status(404).json({error: 'Tarea no encontrada'})
    res.json(todo)
}

export const createTodo = (req, res, next) => {
    try {
        const data = createTodoSchema.parse(req.body)

        const newTodo = {
            id: randomUUID(),
            title: data.title,
            description: data.description ?? null,
            priority: data.priority ?? 'medium',
            completed: false,
            dueDate: data.dueDate ?? null,
            tags: data.tags ?? [],
            createdAt: new Date().toISOString(),  
            updatedAt: new Date().toISOString()  
        }

        todos.push(newTodo)
        res.status(201).json(newTodo)
    } catch (err) {
        next(err)
    }   
}

export const updateTodo = (req, res, next) => {
    try {
        const data = updateTodoSchema.parse(req.body)
        const todo = todos.find(t => t.id === req.params.id)
        if(!todo) return res.status(404).json({error: 'Tarea no encontrada'})

        Object.assign(todo, data, {updatedAt: new Date()})
        todo.updatedAt = new Date()
        res.json(todo)
    } catch (err) {
        next(err)
    }
}

export const deleteTodo = (req, res) => {
    const index = todos.findIndex(t => t.id === req.params.id)
    if(index === -1) return res.status(404).json({error: 'Tarea no encontrada'})

    todos.splice(index, 1)
    res.status(204).send()
}

export const toggleTodo = (req, res) => {
    const todo = todos.find(t => t.id === req.params.id)
    if(!todo) return res.status(404).json({error: 'Tarea no encontrada'})
    todo.completed = !todo.completed
    todo.updatedAt = new Date()
    res.json(todo)
}

export const getStats = (req, res) => {
    const total = todos.length
    const completed = todos.filter(t => t.completed).length
    const pending = total - completed

    res.json({total, completed, pending})
}



   