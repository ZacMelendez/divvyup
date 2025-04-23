import mongoose from "mongoose";

const splitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    percentage: {
        type: Number,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
});

const expenseSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        splitType: {
            type: String,
            enum: ["equal", "percentage", "amount"],
            required: true,
        },
        splits: [splitSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Expense ||
    mongoose.model("Expense", expenseSchema);
