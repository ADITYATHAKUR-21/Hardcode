import bcrypt from "bcryptjs"
import {db} from "../libs/db.js"
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"

export const register = async (req, res) => {

    const {email, password, name } = req.body;

    try {
        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser){
            res.status(400).json({
                error: "user already exits"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser =  await db.user.create({
            data:{
                email,
                password: hashedPassword,
                name,
                role: UserRole.USER

            }
        })

        const token = jwt.sign({id:newUser.id}, process.env.JWT_SECRET,{
            expiresIn:"7d"
        })

        res.cookie("jwt", token,  {
            httpOnly: true,
            samesite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7

        })

        res.status(201).json({
            massage: "User created successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image: newUser.image
            }

        })

    } catch (error) {
        console.error("error creating user", error);
        res.status(500).json({
            error: "creating user error"
        })
      
    }
}

export const login = async (req, res) => {

    const {email, password} = req.body;

    try {
        const user = await db.user.findUnique({
            where: {
                email
            }

        })
        if (!user) {
            return res.status(400).json({
                error: "user not found"
            })
        }


        const ismatch = await bcrypt.compare(password, user.password);
        console.log(ismatch);
        if (!ismatch) {
            return res.status(401).json({
                error: "invalid credentials"
            })
        }
        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })
        res.status(200).json({
            message: "login successfully",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image
            }
        })
        
    } catch (error) {
        console.error("error logging in user", error);
        res.status(500).json({
            error: "logging in user error"
        })
        
    }
}


export const logout = async () => {}

export const check = async () => {}

