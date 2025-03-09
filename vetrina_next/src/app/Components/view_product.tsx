"use client";
import { Product_dto } from "@/app/services/product";
import React from "react";
import Image from "next/image";
import RequestProduct from "./request";
import { Pencil, ShoppingCart, Eye, EyeOff } from "lucide-react"; // Import icons

export default function View_Product({
  product,
  role,
  userId,
}: {
  product: Product_dto;
  role: string;
  userId: string;
}) {
  const [showReq, setShowReq] = React.useState(false);
  const [showFullName, setShowFullName] = React.useState(false);

  return (
    <>
      <div className="relative flex flex-col my-6 bg-white shadow-md border border-slate-200 rounded-lg w-[280px] transition hover:shadow-lg">
        {/* Product Image */}
        <div className="relative h-[200px] m-2.5 overflow-hidden text-white rounded-md">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transform transition duration-300 hover:scale-105"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Price */}
          <h6 className="mb-2 text-slate-800 text-xl font-semibold">$ {product.price}</h6>

          {/* Product Name (Toggleable) */}
          <h6
            onClick={() => setShowFullName(!showFullName)}
            className="flex items-center gap-2 mb-2 text-slate-800 text-lg font-medium cursor-pointer hover:text-teal-600 transition"
          >
            {showFullName ? product.name : `${product.name.substring(0, 20)}...`}
            {showFullName ? <EyeOff size={18} /> : <Eye size={18} />}
          </h6>

          {/* Description */}
          <p className="text-slate-600 text-sm line-clamp-3">{product.description}</p>
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 pt-0 mt-2 flex justify-between items-center">
          {role === "admin" ? (
            <button
              className="flex items-center gap-2 rounded-md bg-blue-600 py-2 px-4 text-sm text-white transition shadow-md hover:bg-blue-700"
              type="button"
            >
              <Pencil size={16} /> Edit
            </button>
          ) : (
            <button
              onClick={() => setShowReq(!showReq)}
              className="flex items-center gap-2 rounded-md bg-green-600 py-2 px-4 text-sm text-white transition shadow-md hover:bg-green-700"
              type="button"
            >
              <ShoppingCart size={16} /> Reserve Now
            </button>
          )}
        </div>
      </div>

      {/* Request Modal */}
      {showReq && <RequestProduct userId={userId} setShowreq={setShowReq} productId={product.id} />}
    </>
  );
}
