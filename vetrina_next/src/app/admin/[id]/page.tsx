'use server';
import {  getProducts_By_Category, Product_Category_dto } from '@/app/services/product';
import CreateProduct from '../../Components/product';
import { getSession } from '@/app/lib/sessions';
import ProductsOverview from '@/app/Components/products';
import { getRequests } from '@/app/services/request';

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Package, Mail, MessageCircle } from "lucide-react";
import { prisma } from '../../../../prisma_client';

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const {id} = await params;
    const user= await getSession();
    console.log(user);
    const allproducts:Product_Category_dto[]= await getProducts_By_Category();
    await prisma.$disconnect();
    const requests = await getRequests();
    
    const productId = Array.isArray(id) ? id[0] : id;
    if (!productId) {
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
        <div className="grid grid-cols-4 gap-10">
            
          
     
        <ProductsOverview   user={user} allproducts={allproducts}/>
        <CreateProduct id={productId} />
        {RenderRequests(requests)}
        </div>
        
        </>
        
    )
    
}


async function RenderRequests(requests: {
  id: string;
  user: { email: string } | null;
  product: { name: string } | null;
  numberClient: string;
  location: string;
  latitude: number;
  longitude: number;
  message: string | null;
  quantity: number;
  createdAt: Date;
}[]) {
  return (
    <div className="p-8 relative right-25  bg-gray-50 dark:bg-gray-900 rounded-xl shadow-xl h-fit w-full max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white relative">
        Requests
        <span className="absolute -bottom-2 left-0 w-35 h-1  bg-blue-500 rounded-full animate-pulse"></span>
      </h2>
      <div className="flex  flex-col gap-6">
        {requests.map((request) => (
          <Card
            key={request.id}
            className="p-6 rounded-lg w-fit shadow-lg hover:shadow-2xl transition-all bg-white dark:bg-gray-800"
          >
            <CardContent>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-500 transition-all duration-300">
                  {request.product ? request.product.name : "Unknown Product"}
                </span>
                <span className="block h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"></span>
                </h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">Quantity:</span>{" "}
                  {request.quantity}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">Requested by:</span>{" "}
                  {request.user ? request.user.email : "Unknown User"}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">Location:</span> {request.location}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">Created At:</span>{" "}
                  {request.createdAt.toLocaleString()}
                </p>
                <p className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">Client Number:</span>{" "}
                  {request.numberClient}
                </p>
                {request.message && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 border-t pt-3 mt-3">
                    <span className="font-medium">Message:</span> {request.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
