import bcryput from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const SIGN_OPTIONS = {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
};

const signToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, SIGN_OPTIONS);
};

export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'Email ya registrado' });
        }
        const hashed = await bcryput.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashed,
            role: role || 'user',
        });

        const userSafe ={
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };

        return res.status(201).json(userSafe);
    } catch (error) {
        console.error(err);
        return res.status(500).json({ message: 'Error de servidor' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        const isMatch = await bcryput.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const token = signToken(user._id);

        const userSafe ={
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };

        return res.status(200).json({ user: userSafe, token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error de servidor' });
    }
};

export const me = async (req, res) => {
    const user = req.user;
    const userSafe ={
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };
    return res.status(200).json(userSafe);
};