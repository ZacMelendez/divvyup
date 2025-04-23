import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        expenses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Expense",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Group || mongoose.model("Group", groupSchema);
