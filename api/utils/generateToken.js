import jwt from 'jsonwebtoken'

// MIDDLEWARE FUNCTION TO GENERATE TOKEN AND SET COOKIE
export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({id: userId}, process.env.JWT_SECRET_KEY, {
        expiresIn: "15d"
    })

    res.cookie("access_token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    })
}