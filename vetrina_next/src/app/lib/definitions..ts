import { z } from 'zod'
import { prisma } from '../../../prisma_client'
 
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  role: z.enum(['admin', 'user']),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})
export const createProductSchema=z.object(
  {
    name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }).trim(),
    category: z.string().min(2, { message: 'Category must be at least 2 characters long.' }).trim(),
    description: z.string().min(2, { message: 'Description must be at least 2 characters long.' }).trim(),
    price: z.number().min(0.01, { message: 'Price must be at least 0.01' }),
    image: z.string().url(),
    userId: z.string()
  }
)
export const CreateRequestSchema=z.object({
  userId: z.string(),
  productId: z.string(),
  numberClient: z.string().length(8, { message: 'Number must be 9 characters long.' }),
  location: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  message: z.string(),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1.' }),
})
export type RequestState = {
  errors?: {
      latitude?: string[];
      longitude?: string[];
      userId?: string[];
      productId?: string[];
      message?: string[];
      numberClient?: string[];
      location?: string[];
      quantity?: string[];
  };
  message?: string;
} | undefined

export type ProductState = 
|{
  errors?: {
    userId?: string[]
    name?: string[]
    category?: string[]
    description?: string[]
    price?: string[]
    image?: string[]
  }
  message?: string
}  | undefined
export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        role?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined
export type User  = {
  id: string|undefined
  name: string | undefined
  email: string
  password: string
  role: string
}
export async function findUser(id:string) {
  return await prisma.user.findFirst({
    where:{
      id:id
    },
    select:{
      email:true
    }
  })
}