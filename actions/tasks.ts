'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createTaskSchema, updateTaskStatusSchema } from '@/lib/validator'
import { TaskStatus } from '@/lib/generated/prisma/enums'
import { Task } from '@/lib/generated/prisma/browser'

export async function createTask(data: { title: string }){
  // Check authentication first
  const user = await getSession()

  if (!user) {
    return { 
      success: false, 
      message: 'Unauthorized. Please log in.' 
    }
  }

  try {
    // Validate input data
    const validatedData = createTaskSchema.parse(data)

    // Create task
    await prisma.task.create({
      data: {
        title: validatedData.title,
        userId: user.id,
      },
    })

    // Revalidate the dashboard page
    revalidatePath('/dashboard')

    return { 
      success: true, 
      message: 'Task created successfully!' 
    }

  } catch (error: any) {
    // Handle Zod validation errors
    if (error.errors) {
      return { 
        success: false, 
        message: error.errors[0].message 
      }
    }

    // Handle Prisma errors
    if (error.code === 'P2002') {
      return { 
        success: false, 
        message: 'A task with this title already exists' 
      }
    }

    console.error('Create task error:', error)
    return { 
      success: false, 
      message: 'Failed to create task' 
    }
  }
}

export async function updateTaskStatus(data:Task) {
  const user = await getSession()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {

    // Verify task belongs to user
    const task = await prisma.task.findUnique({
      where: { id: data.id },
    })

    if (!task || task.userId !== user.id) {
      return { 
        success: false, 
        message: 'Task not found or unauthorized access'
      }
    }

    await prisma.task.update({
      where: { id: data.id },
      data: { status: data.status },
    })

    revalidatePath('/dashboard')
    return { success: true , message: 'Task updated successfully!' }
  } catch (error: any) {
    if (error.errors) {
      return { error: error.errors[0].message }
    }
    return {  success: false, message: 'Failed to update task' }
  }
}

export async function getTasks() {
    const user = await getSession()

    if (!user) {
        return []
    }

    const tasks = await prisma.task.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
    })
    return tasks
}
