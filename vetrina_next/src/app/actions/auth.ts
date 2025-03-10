
'use server';
import { prisma } from "../../../prisma_client"
import { FormState, SignupFormSchema } from "../lib/definitions."
import bcrypt from 'bcrypt'
import { AuthError } from 'next-auth';
import { signIn } from "../../../auth"


export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),

    password: formData.get('password'),
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
    const { name, email, password, role } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const existingUser = await prisma.user.findFirst({
            where: { email }
        })

        if (existingUser) {
            return {
                error: 'User already exists'
            }
        }

        // Get or create role
        const userRole = await prisma.role.upsert({
            where: { name: role },
            update: {},
            create: { name: role }
        })

        // Create new user
        await prisma.user.create({
            data: {
                name,
                email,
                password:hashedPassword, 
                roleId: userRole.id
            }
        })

    } 
    catch (error) {
        return {
            error: 'Failed to create user '+error
        }
    }
    
}

 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
    
    
    
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}