import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
export const getAllUsers = async (req, res, next) => {
    try {
        //get all users
        const users = await User.find();
        return res.status(200).json({ message: "OK", users });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(200).json({ message: "ERROR", cause: error.message });
        }
        else {
            return res.status(200).json({ message: "ERROR", cause: "Unknown error" });
        }
    }
};
export const userSignup = async (req, res, next) => {
    try {
        //user signup
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(401).send("User already registered");
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        // create token and store cookie
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });
        return res
            .status(201)
            .json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(200).json({ message: "ERROR", cause: error.message });
        }
        else {
            return res.status(200).json({ message: "ERROR", cause: "Unknown error" });
        }
    }
};
export const userLogin = async (req, res, next) => {
    try {
        //user login
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not registered");
        }
        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).send("Incorrect Password");
        }
        // create token and store cookie
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });
        return res
            .status(200)
            .json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(200).json({ message: "ERROR", cause: error.message });
        }
        else {
            return res.status(200).json({ message: "ERROR", cause: "Unknown error" });
        }
    }
};
export const verifyUser = async (req, res, next) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res
            .status(200)
            .json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(200).json({ message: "ERROR", cause: error.message });
        }
        else {
            return res.status(200).json({ message: "ERROR", cause: "Unknown error" });
        }
    }
};
export const userLogout = async (req, res, next) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        return res
            .status(200)
            .json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(200).json({ message: "ERROR", cause: error.message });
        }
        else {
            return res.status(200).json({ message: "ERROR", cause: "Unknown error" });
        }
    }
};
// import { NextFunction, Request, Response } from "express";
// import User from "../models/User.js";
// import { hash, compare} from "bcrypt";
// import { createToken } from "../utils/token-manager.js";
// import { COOKIE_NAME } from "../utils/constants.js";
// export const getAllUsers = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const users = await User.find();
//     return res.status(200).json({ message: "OK", users });
//   } catch (error) {
//     console.log(error);
//     if (error instanceof Error) {
//       return res.status(200).json({ message: "ERROR", cause: error.message });
//     } else {
//       return res.status(200).json({ message: "ERROR", cause: "Unknown error" });
//     }
//   }
// };
// export const userSignup = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     //user signup
//     const {name,email,password} = req.body;
//     const hashedPassword = await hash(password,10);
//     const user = new User({name,email,password:hashedPassword});
//     await user.save();
//     //create token and store cookie
//     res.clearCookie(COOKIE_NAME,{
//       httpOnly:true,
//       domain:"localhost",
//       signed:true,
//       path:"/", 
//     });
//     const token  = createToken(user._id.toString(),user.email,"7d");
//     const expires = new Date();
//     expires.setDate(expires.getDate()+7);
//     res.cookie(COOKIE_NAME,token,{path:"/",domain:"localhost",expires,httpOnly:true,signed:true,});
//     return res.status(201).json({ message: "OK",name:user.name,email:user.email});
//   } catch (error) {
//     if (error instanceof Error) {
//       return res.status(201).json({ message: "ERROR", cause: error.message });
//     } else {
//       return res.status(200).json({ message: "ERROR", cause: "Unknown error" });
//     }
//   }
// };
// export const userLogin = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     //user login
//     const {email,password} = req.body;
//     const user= await User.findOne({email});
//     if(!user){
//       return res.status(401).send("User not registered");
//     }
//     const isPasswordCorrect = await compare(password,user.password);
//     if(!isPasswordCorrect){
//       return res.status(403).send("Incorrect Password");
//     }
//     res.clearCookie(COOKIE_NAME,{
//       httpOnly:true,
//       domain:"localhost",
//       signed:true,
//       path:"/", 
//     });
//     const token  = createToken(user._id.toString(),user.email,"7d");
//     const expires = new Date();
//     expires.setDate(expires.getDate()+7);
//     res.cookie(COOKIE_NAME,token,{path:"/",domain:"localhost",expires,httpOnly:true,signed:true,});
//     return res.status(200).json({ message: "OK",name:user.name,email:user.email});
//   } catch (error) {
//     if (error instanceof Error) {
//       return res.status(200).json({ message: "ERROR", cause: error.message });
//     } else {
//       return res.status(200).json({ message: "ERROR", cause: "Unknown error" });
//     }
//   }
// };
// export const verifyUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user= await User.findOne({email: res.locals.jwtData.email});
//     if(!user){
//       return res.status(401).send("User not registered OR Token malfunctioned");
//     }
//     console.log(user._id.toString(),res.locals.jwtData.id);
//     if(user.id.toString() !== res.locals.jwtData.id){
//       res.status(401).send("Permission didn't match");
//     }
//     return res.status(200).json({ message: "OK",name:user.name,email:user.email});
//   } catch (error) {
//     if (error instanceof Error) {
//       return res.status(200).json({ message: "ERROR", cause: error.message });
//     } else {
//       return res.status(200).json({ message: "ERROR", cause: "Unknown error" });
//     }
//   }
// };
