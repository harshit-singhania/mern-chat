import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateTokens } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

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
    // try to get the email and password 
    const { email, password } = req.body;

    // check if user exists in the db 
    try {
        const user = await User.findOne({ email });

        // if user does not exist, return 400 status code
        if (!user) {
            return res.status(400).json(
                { message: 'Invalid credentials' }
            )
        }

        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json(
                { message: 'Invalid credentials' }
            )
        }
        else {
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            })
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const logout = async (req, res) => {
    // clear out the cookies 
    try {
        res.cookie("jwt", "", { maxAge: 0 }); 
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const updateProfile = async (req, res) => {
    try {
        // get the profile pic from the request body
        const { profilePic } = req.body;

        // get the user from the request object 
        const userId = req.user._id

        if (!profilePic) {
            return res.status(400).json({ message: 'Profile pic is required' });
        }

        const profilePicUploadResponse = await cloudinary.uploader.upload(profilePic)

        // update the user profile pic in the db 
        const updatedProfilePicUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: profilePicUploadResponse.secure_url },
            { new: true }
        )

        res.status(200).json({
            _id: updatedProfilePicUser._id,
            fullName: updatedProfilePicUser.fullName,
            email: updatedProfilePicUser.email,
            profilePic: updatedProfilePicUser.profilePic,
        })
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error' });
        
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error' });
        
    }
}
