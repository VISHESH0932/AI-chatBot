import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

const PORT= process.env.PORT || 5000;
connectToDatabase()
 .then(()=>{
    app.listen(PORT,()=> console.log("Server Open & connected To databse"));
 })
.catch((err) => console.log(err));


// sk-proj-he994ybkGdxvW3dGibjUT3BlbkFJGldVOVKmg3Qh9BUyKTg8