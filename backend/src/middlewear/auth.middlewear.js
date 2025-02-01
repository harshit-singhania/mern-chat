import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    // the next function calls the next middleware in the stack

    try {
        const token = req.cookies.jwt 

        if (!token) {
            // un authorized access
            return res.status(401).json(
                { message: 'Unauthorized access' }
            )
        }

        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json(
                { message: 'Unauthorized access' }
            )
        }

        // find the user with the id and remove the password from the response
        const user = await User.findById(decoded.id).select('-password');

        // if user does not exist, return 404 status code
        if (!user) {
            return res.status(404).json(
                { message: 'User not found' }
            )
        }

        // set the user in the request object if the user exists
        req.user = user
        next()
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
}