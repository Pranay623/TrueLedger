import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import prisma from "@/lib/prisma";
import { Role } from "@/app/generated/prisma"

const JWT_SECRET = process.env.JWT_SECRET!


export interface AuthUser {
  id: string
  email: string
  username: string
  usertype: Role
}


export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) return null

    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: string
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
        usertype: true,
      },
    })

    if (!user) return null

    return user
  } catch {
    return null
  }
}


export async function requireAuth() {
  const user = await getAuthUser()

  if (!user) {
    return {
      error: NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      ),
    }
  }

  return { user }
}


export async function requireRole(roles: Role[]) {
  const auth = await requireAuth()

  if ("error" in auth) return auth

  if (!roles.includes(auth.user.usertype)) {
    return {
      error: NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      ),
    }
  }

  return auth
}
