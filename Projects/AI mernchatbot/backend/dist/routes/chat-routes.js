import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { deleteChats, generationChatCompletion, sendChatsToUser, } from "../controllers/chat-controllers.js";
//Protected API
const chatRoutes = Router();
chatRoutes.post("/new", validate(chatCompletionValidator), verifyToken, generationChatCompletion);
chatRoutes.get("/all-chats", verifyToken, sendChatsToUser);
chatRoutes.delete("/delete", verifyToken, deleteChats);
export default chatRoutes;
// import { Router } from "express";
// import { verifyToken } from "../utils/token-manager.js";
// import { generationChatCompletion } from "../controllers/chat-controllers.js";
// import { chatCompletionValidator, validate } from "../utils/validators.js";
// //protectec API
// const chatRoutes = Router();
// chatRoutes.post("/new",
//     validate(chatCompletionValidator),
//     verifyToken,
//     generationChatCompletion
// );
// export default chatRoutes;
