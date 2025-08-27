import mongoose from 'mongoose';

const {Schema} = mongoose;
const {ObjectId} = Schema;

const orderSchema = new mongoose.Schema({
    products: [{ type: ObjectId, ref: "Product" }],
    payment: {},
    buyer: { type: ObjectId, ref: "User" },
    status: {type: String, default: "Not Processed", enum: [
        "Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"
    ]},
}
, {timestamps: true});

export default mongoose.model("Order", orderSchema);