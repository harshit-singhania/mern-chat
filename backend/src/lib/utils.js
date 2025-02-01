import jwt from 'jsonwebtoken';

export const generateTokens = (userId, res) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { 
            expiresIn: '1h', 
            
         }
    )

    res.cookie('jwt', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== 'development',
    });

    return token;
}