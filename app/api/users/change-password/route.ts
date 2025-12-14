import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  const auth = await requireAuth()
  if ("error" in auth) return auth.error

  const { currentPassword, newPassword } = await req.json()

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { message: "Both current and new password are required" },
      { status: 400 }
    )
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { message: "Password must be at least 8 characters long" },
      { status: 400 }
    )
  }

    // Fetch user with password
  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: {
      password: true,
    },
  })

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    )
  }

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, user.password)

  if (!isValid) {
    return NextResponse.json(
      { message: "Current password is incorrect" },
      { status: 401 }
    )
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // Rotate securityId → invalidates refresh tokens
  await prisma.user.update({
    where: { id: auth.user.id },
    data: {
      password: hashedPassword,
      securityId: crypto.randomUUID(),
    },
  })

  return NextResponse.json({
    message: "Password changed successfully",
  })
}
