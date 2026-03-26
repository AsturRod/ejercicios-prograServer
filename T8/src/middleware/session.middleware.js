import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

export const sessionMiddleware = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1]: null;
        if(!token){
            return res.status(401).json({ message: 'Token no proporcionado' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findbyId(decoded.userId);

        if(!user){
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        req.user = user;
        next();
    }catch(error){
        console.error(err);
        return res.status(401).json({ message: 'Token inválido' });
    }
};