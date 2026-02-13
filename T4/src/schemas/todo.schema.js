import {z} from 'zod';

export const createTodoSchema = z.object({
    title:z.string().min(3).max(100),
    description:z.string().max(500).optional(),
    priority:z.enum(['low','medium','high']).default('medium'),
    dueDate:z.string().datetime().optional(),
    tags:z.array(z.string()).max(5).optional()
}).refine(data=>{
    if(data.dueDate) return true
    return new Date(data.dueDate) > new Date()},{
    message:'La fecha de vencimiento debe ser futura',
    path:['dueDate']

})

export const updateTodoSchema = createTodoSchema.partial()