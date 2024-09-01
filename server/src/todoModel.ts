import mongoose, { Schema } from "mongoose";

const todoScheme: Schema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String
    },
    isComplated: {
        type: Boolean
    }
})

export default mongoose.model("todos", todoScheme, "todos")