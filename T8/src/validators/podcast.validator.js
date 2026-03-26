const allowedCategories = ['Technology', 'Health', 'Business', 'Education', 'Entertainment'];

export const ValidateCreatePodcast = (req, res, next) => {

    const { title, description, category, duration } = req.body;

    if (!title || title.length < 3) {
        return res.status(400).json({ message: "El título es requerido y debe tener al menos 3 caracteres" });
    }

    if (!description || description.length < 10) {
        return res.status(400).json({ message: "La descripción es requerida y debe tener al menos 10 caracteres" });
    }

    if (!category || !allowedCategories.includes(category)) {
        return res.status(400).json({ message: `La categoría es requerida y debe ser una de las siguientes: ${allowedCategories.join(', ')}` });
    }

    if (duration !== undefined && (typeof duration !== 'number' || duration <= 0)) {
        return res.status(400).json({ message: "La duración debe ser un número positivo" });
    }

    next();
};  