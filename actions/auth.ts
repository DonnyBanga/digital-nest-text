"use server";

import { createSession, deleteSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { loginSchema, signupSchema } from "@/lib/validator";
import { compare, hash } from "bcrypt";
import { redirect } from "next/navigation";

export async function signup(data:{ email: string, password: string }) {
  try {
   // Validate input data first
    const validatedData = signupSchema.parse(data)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: { id: true } // Only select what we need
    })

    console.log(existingUser)

    if (existingUser) {
      return { 
        success: false, 
        message: 'User with this email already exists' 
      }
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
      },
    })

    // Create session
    await createSession(user.id.toString())

    // Return success (don't redirect here since you're handling it client-side)
    return { 
      success: true, 
      message: 'Account created successfully!' 
    }
    
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.errors) {
      return { 
        success: false, 
        message: error.errors[0].message 
      }
    }
    
    // Handle Prisma unique constraint violation (in case of race condition)
    if (error.code === 'P2002') {
      return { 
        success: false, 
        message: 'User with this email already exists' 
      }
    }
    
    console.error('Signup error:', error)
    return { 
      success: false, 
      message: 'Failed to create account' 
    }
  }
}

export async function login(data: { email: string; password: string }): Promise<{ success: boolean; message: string }> {
  try {
    // Validate input data first
    const validatedData = loginSchema.parse(data)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: { 
        id: true, 
        email: true, 
        password: true 
      }
    })

    if (!user) {
      return { 
        success: false, 
        message: 'Invalid email or password' 
      }
    }

    // Verify password
    const isValidPassword = await compare(validatedData.password, user.password)

    if (!isValidPassword) {
      return { 
        success: false, 
        message: 'Invalid email or password' 
      }
    }

    // Create session
    await createSession(user.id.toString())

    // Return success
    return { 
      success: true, 
      message: 'Logged in successfully!' 
    }
    
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.errors) {
      return { 
        success: false, 
        message: error.errors[0].message 
      }
    }
    
    console.error('Login error:', error)
    return { 
      success: false, 
      message: 'Failed to log in' 
    }
  }
}

export async function logout() {
  console.log('delete')
  await deleteSession()
  redirect('/')
}