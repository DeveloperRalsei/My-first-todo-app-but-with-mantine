import mongoose, { Schema } from "mongoose";

const todoScheme: Schema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String
    },
})

export default mongoose.model("todos", todoScheme, "todos")