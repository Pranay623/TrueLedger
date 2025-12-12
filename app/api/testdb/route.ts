import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Test the connection
    await prisma.$connect()
    
    // Try to fetch users
    const users = await prisma.user.findMany({
      take: 10
    })
    
    return NextResponse.json({ 
      success: true, 
      count: users.length,
      users 
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}