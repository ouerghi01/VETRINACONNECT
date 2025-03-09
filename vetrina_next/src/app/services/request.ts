import { prisma } from "../../../prisma_client";
import { findUser } from "../lib/definitions.";
import { findProduct } from "./product";

export type CreateRequest = {
    userId: string;
    productId: string;
    numberClient: string;
    location: string;       // Full address (optional)
    latitude: number;       // Latitude for precise location
    longitude: number;      // Longitude for precise location
    message?: string;       // Optional message
    quantity: number;
};

export async function sendRequest(request_product: CreateRequest) {
    console.log(request_product);
    if (!request_product.userId || !request_product.productId) {
        throw new Error("User ID and Product ID are required.");
    }
    if (!request_product.numberClient || !request_product.location) {
        throw new Error("Client's number and location are required.");
    }
    if (isNaN(request_product.latitude) || isNaN(request_product.longitude)) {
        throw new Error("Invalid latitude or longitude values.");
    }

    const [user, product] = await Promise.all([
        findUser(request_product.userId),
        prisma.product.findUnique({ where: { id: request_product.productId } })
    ]);

    if (!user) throw new Error("User not found.");
    if (!product) throw new Error("Product not found.");

    
    const requestExists = await prisma.request.count({
        where: {
            userId: request_product.userId,
            productId: request_product.productId,
        }
    });

    if (requestExists > 0) {
        throw new Error("A request for this product already exists.");
    }

    // Create the request
    try {
        const req = await prisma.request.create({
            data: {
                userId: request_product.userId,
                productId: request_product.productId,
                latitude: request_product.latitude,
                longitude: request_product.longitude,
                numberClient: request_product.numberClient,
                message: request_product.message || "",
                quantity: request_product.quantity || 1,
                location: request_product.location,
            }
        });

        return req;
    } catch (error) {
        console.error("Error creating request:", error);
        throw new Error("Failed to send request for product.");
    }
}
export async function getRequests() {
    const requests = await prisma.request.findMany();
    const requestPromises = requests.map(async (request) => ({
        id: request.id,
        user: await findUser(request.userId || ''),
        product: await findProduct(request.productId || ''),
        numberClient: request.numberClient,
        location: request.location,
        latitude: request.latitude,
        longitude: request.longitude,
        message: request.message,
        quantity: request.quantity,
        createdAt: request.createdAt,
    }));
    
    return Promise.all(requestPromises);
}