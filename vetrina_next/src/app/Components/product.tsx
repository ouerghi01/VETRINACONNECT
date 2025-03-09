'use client'
import { createProductAction } from '@/app/actions/product';
import React, { useActionState } from 'react';
function encodeImageFileAsURL(element: any, setImage: any) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        setImage(reader.result)
    }
    reader.readAsDataURL(file);
  }
export default  function CreateProduct({
  id,
}: {
  id: string | undefined;
}
) {
  const [errorMessage, formAction, isPending] = useActionState(
    createProductAction,
    undefined
  );
  const [image, setImage] = React.useState('');
  const [show,setShow] =React.useState(false);
   
  return (
    <section className="bg-gray-50 relative right-50    inset-5 dark:bg-gray-900 h-fit flex items-center justify-center">
      
     <button  onClick={() => {
            setShow(!show)
        }}
         type="button" className="text-white  absolute items-center top-2.5 cursor-pointer bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
         >Add Product</button>
     
     {show &&
      <div className="w-full max-w-md scale-z-200 z-50  bg-white rounded-lg shadow-lg relative top-10 left-5 dark:border dark:bg-gray-800 dark:border-gray-700 p-6">
        

        
        
        <form className="space-y-4 " action={formAction} >
          <input type="hidden" name="userId" value={id} />

          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Product Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Enter product name"
              className="w-full p-2.5 border rounded-lg bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
            <div>
            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Product Category<span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue=""
              className="w-full p-2.5 border rounded-lg bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="" disabled>Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food">Food</option>
              <option value="Books">Books</option>
              <option value="Computers & Accessories">Computers & Accessories</option>


              
              <option value="Home">Home & Garden</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
            {errorMessage?.errors?.category && (
              <p className="text-sm text-red-500 mt-1">{errorMessage.errors.category}</p>
            )}
            </div>

          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              placeholder="Enter product description"
              className="w-full p-2.5 border rounded-lg bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              required
              step="0.01"
              placeholder="Enter price"
              onChange={(e) => e.target.value = parseFloat(e.target.value).toString()}
              className="w-full p-2.5 border rounded-lg bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Upload Image
            </label>
            <input
              onChange={(e) => {
                encodeImageFileAsURL(e.target, setImage)
              }}
              id="imageFile"
              type="file"
              accept="image/*"
              className="w-full border rounded-lg p-2.5 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input type="hidden" name="image" value={image} />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating Product...
              </div>
            ) : (
              'Create Product'
            )}
          </button>

          {errorMessage && (
            <p className="text-sm text-red-500 text-center">
              {errorMessage.message || JSON.stringify(errorMessage.errors)}
            </p>
          )}
        </form>
      </div>}
    </section>
  );
}

