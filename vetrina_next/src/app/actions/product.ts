"use server";
import { createProductSchema, ProductState } from "../lib/definitions.";
import { Create_Product_dto, createProduct } from "../services/product";

export async function createProductAction(
    prevState: ProductState,
    formData: FormData,
) {
    
    const validatedFields = createProductSchema.safeParse(
        {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            category: formData.get('category') as string,
            price: parseInt(formData.get('price') as string),
            image: formData.get('image') as string,
            userId: formData.get('userId') as string,
        }
    )
    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    const product_dto:Create_Product_dto = validatedFields.data
    try {
        await createProduct(product_dto)
        return {
            message: 'Product created successfully'
        }
    } catch (error) {
        return {
            message: 'Failed to create product ' + error
        }
    }

    
} 