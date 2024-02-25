import User from '../models/user.model.js';
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


export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        // Check if the username is available in the validUser object
        const username = validUser.username || 'DefaultUsername';

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return res.status(401).json({
                error: 'Wrong credentials!'
            });
        }

        const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET);
        const {password:pass, ...rest} = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json({ rest });

    } catch (error) {
        next(error);
    }
};
