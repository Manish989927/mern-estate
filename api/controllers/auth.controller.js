import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword =   bcryptjs.hashSync(password, 12);
        const newUser = new User({ username, email, password: hashedPassword});
        
        // Use await to handle the asynchronous save operation
        await newUser.save();

        res.json({
            message: 'Signup success! Please signin'
        });
    } catch (err) {
        console.log('SIGNUP ERROR', err);
        if (err.code === 11000) {
            // MongoDB duplicate key error (e.g., duplicate email)
            return res.status(400).json({
                error: 'Email is taken'
            });
        }
        res.status(400).json({
            error: 'Signup failed'
        });
    }
};
