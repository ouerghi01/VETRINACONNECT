'use server';
import { CreateRequestSchema, RequestState } from "../lib/definitions.";
import { sendRequest } from "../services/request";

export async function createRequestAction(
    prevState: RequestState,
    formData: FormData,
) : Promise<RequestState>{
    console.log(formData.get("numberClient"))
    const validatedFields = CreateRequestSchema.safeParse({
        userId: formData.get("userId"),
        productId: formData.get("productId"),
        numberClient: formData.get("numberClient"),
        location: formData.get("location"),
        latitude: parseFloat(formData.get("latitude") as string) || 0,
        longitude: parseFloat(formData.get("longitude") as string) || 0,
        message: formData.get("message"),
        quantity: Number(formData.get("quantity")) || 1,
    });
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
        
    const request_product = validatedFields.data;
    try {
        console.log(request_product)
        await sendRequest(request_product);
        return {
            message: 'Request sent successfully, we will contact you soon.',
        }
    }
    catch (error) {
        return {
            message: error instanceof Error ? error.message : '❌ Failed to send request',
        };
    }
}