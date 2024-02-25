import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword =   bcryptjs.hashSync(password, 12);
        const newUser = new User({ username, email, password: hashedPassword});
        
        // Use await to handle the asynchronous save operation
        await newUser.save();

        res.json({
            message: 'Signup success!  '
        });
    } catch (err) {
        console.log('SIGNUP ERROR', err);
        if (err.code === 11000) {
            // MongoDB duplicate key error (e.g., duplicate email)
            next(errorHandler(404, 'email already exists!'));
        }
        res.status(400).json({
            error: 'Signup failed'
        });
    }
};


export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found!'));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

        const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json({ rest });
        
        // Add a return statement to exit early when the password is incorrect
        return;

    } catch (error) {
        next(error);
    }
};