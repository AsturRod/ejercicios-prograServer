import { z } from 'zod'


const todoBaseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).max(5).optional()
})


export const createTodoSchema = todoBaseSchema.refine(
  (data) => {
    if (!data.dueDate) return true
    return new Date(data.dueDate) > new Date()
  },
  {
    message: 'dueDate must be in the future',
    path: ['dueDate']
  }
)


export const updateTodoSchema = todoBaseSchema.partial().refine(
  (data) => {
    if (!data.dueDate) return true
    return new Date(data.dueDate) > new Date()
  },
  {
    message: 'dueDate must be in the future',
    path: ['dueDate']
  }
)
