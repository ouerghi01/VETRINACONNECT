import { prisma } from "../../../prisma_client";

export interface Create_Product_dto {
    userId: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
}
export interface Product_dto {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}
export interface Product_Category_dto {
    category: string;
    products: Product_dto[];
}
export const  findProduct= async (id:string) => {
    return await prisma.product.findUnique({
        where:{
            id: id
        },
        select:{
            name: true,
        }})
}
export const createProduct = async (product: Create_Product_dto) => {
    const user= await prisma.user.findUnique({
        where:{
            id: product.userId
        },
        select:{
            role: true
        }
    });
    if(!user || user.role.name !== 'admin'){
        throw new Error('User not found or not a admin');
    }
    const prd= await prisma.product.create({
        data:{
            userId: product.userId,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            category:product.category
        }
    })
    await prisma.user.update(
        {
            where:{
                id: product.userId
            },
            data:{
                products:{
                    connect:{
                        id: prd.id
                    }
                }
            }
        }
    )
       
};
export const getProducts_By_Category = async (): Promise<Product_Category_dto[]> => {
    const product_by_category = await prisma.product.findMany({
      })
    const categories=[...new Set(product_by_category.map(v => v.category))]
    if (categories.length < 1)  {
        return []
    }
    
    const  oo:Product_Category_dto[]=[]
    for (let index = 0; index < categories.length; index++) {
        const element = categories[index];
        const xx=product_by_category.filter(v => v.category==element).map(prd => {
            return {
            id: prd.id,
            name: prd.name,
            description: prd.description,
            price: prd.price,
            
            image: prd.image
            }
        })
        oo.push({
            category:element,
            products:xx

        })
        
    }
    return oo

};
