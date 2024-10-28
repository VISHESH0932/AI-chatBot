import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAIApi, ChatCompletionRequestMessage, ChatCompletionResponseMessage } from "openai";

export const generationChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }

    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) return res.status(401).json({ message: "User not registered OR Token malfunctioned" });

        // Grab chats of user
        const chats = user.chats.map(({ role, content }) => ({ role, content })) as ChatCompletionRequestMessage[];
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });

        // Send all chats with the new one to OpenAI API
        const config = configureOpenAI();
        const openai = new OpenAIApi(config);
        const chatResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: chats,
        });

        const assistantMessage = chatResponse.data.choices[0]?.message as ChatCompletionResponseMessage | undefined;
        if (!assistantMessage) {
            return res.status(500).json({ message: "Failed to get response from OpenAI" });
        }

        user.chats.push(assistantMessage);
        await user.save();
        return res.status(200).json({ chats: user.chats });
    } catch (error: any) { // Here we define the error type
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const sendChatsToUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // User token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if(user._id.toString()!== res.locals.jwtData.id){
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    } catch (error: any) { // Here we define the error type
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};

export const deleteChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // User token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        // Reset user's chats
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "OK" });
    } catch (error: any) { // Here we define the error type
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
