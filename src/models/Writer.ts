import { Schema, model } from "mongoose";
import Role from "./Role";

const WriterSchema = new Schema({
    name: {type: String, required: true},
    birthDate: {type: Date, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    booksPublished: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now()},
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'Role'
    }]
});


export default model('Writer', WriterSchema);