export const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || name.length < 2) {
        return res.status(400).json({ message: "El nombre es requerido y debe tener al menos 2 caracteres" });
    }
    if (!email || !/.+\@.+\..+/.test(email)) {
        return res.status(400).json({ message: "El email es requerido y debe ser válido" });
    }
    if (!password || password.length < 8) {
        return res.status(400).json({ message: "La contraseña es requerida y debe tener al menos 8 caracteres" });
    }
    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
}
    next();
};
