import { getSession } from "@/app/lib/sessions";
import { prisma } from "../../../../prisma_client";
import { Create_Product_dto, createProduct, getProducts } from "@/app/services/product";
async function validate_user() {
    const session= await getSession()
    if(!session){
        return {
            status: 401,
            body: {
                message: 'Unauthorized'
            }
        }
    }
    const user = await prisma.user.findFirst({
            where: { id: session.id },
            select:{
                id:true,
                role:{
                    select:{
                        name:true
                    }
                }
            }
        });
    if(!user || user.role.name !== 'admin'){
        return {
            status: 403,
            body: {
                message: 'Forbidden'
            }
        }
    }
}
export async function GET(request: Request) {
    await validate_user();
    const products= await getProducts();
    return {
        status: 200,
        body: products
    }
}
