import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateTokens } from '../lib/utils.js';

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (password.length < 8 || !fullName || !email || !password) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        // check if user with this email already exists
        const existingUser = await User.findOne( {email} );
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const newUser = new User({
            fullName:fullName,
            email:email,
            password: hashedPassword,
        })
        
        // save user to database
        if(newUser){
            // return res.status(201).json({ message: 'User created successfully' });
            // generate jwt token
            generateTokens(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        } else {
            return res.status(400).json({ message: 'User creation failed' });
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const login = async (req, res) => {
    res.send('Login route');
}

export const logout = async (req, res) => {
    res.send('Logout route');
}

