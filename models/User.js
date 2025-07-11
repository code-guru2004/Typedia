import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        
    },
    lastName: {
        type: String,
    },
    avatar: {
        type: String,
    },
    bio: {
        type: String,
        default: "Content Creator"
    },
    role: {
        type: String,
        enum: ['admin', 'author', 'reader'],
        default: 'author'
    },
    joinedAt: {
        type: Date,
        default: () => new Date()
    },
    social: {
        twitter: { type: String, default: '' },
        facebook: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        instagram: { type: String, default: '' },
    },
    followers: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    following: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    firebaseUID: {
        type: String,
        unique: true,
    },

});
export default mongoose.models.User || mongoose.model("User", userSchema);