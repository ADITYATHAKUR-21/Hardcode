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

        const hashedPassword = bcrypt.hash(password, 10);

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

export const login = async () => {}

export const logout = async () => {}

export const check = async () => {}

