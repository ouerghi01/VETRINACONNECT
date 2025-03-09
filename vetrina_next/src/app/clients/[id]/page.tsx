import View_Product from "@/app/Components/view_product";
import {  getProducts_By_Category } from "@/app/services/product";
import { prisma } from "../../../../prisma_client";
import ProductsOverview from "@/app/Components/products";
import { getSession } from "@/app/lib/sessions";

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  })
  {
    console.log(await params);
    const {id} = await params;
    const allproducts = await getProducts_By_Category();
    const user= await getSession();
    await prisma.$disconnect();
    
    const productId = Array.isArray(id) ? id[0] : id;
    if (!productId || !user) {
        return (
          <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg dark:border dark:bg-gray-800 dark:border-gray-700 p-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
                Unauthorized
              </h1>
              <p className="text-sm text-red-500 text-center">You are not authorized to view this page.</p>
            </div>
          </section>
        );
    }
    return (
        <>
            
            <div className="col-span-2">
              <ProductsOverview user={user} allproducts={allproducts}/>
                         
            </div>
             
        
        </>
        
    )
    

  }