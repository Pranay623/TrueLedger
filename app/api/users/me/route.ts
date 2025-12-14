import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@/app/generated/prisma";

export async function GET() {
  const auth = await requireAuth()
  if ("error" in auth) return auth.error

  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: {
      id: true,
      email: true,
      username: true,
      fullName: true,
      usertype: true,
      institutionname: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ user })
}

export async function PATCH(req: Request) {
  const auth = await requireAuth()
  if ("error" in auth) return auth.error

  const body = await req.json()

  const data: any = {}

  if (body.fullName) {
    data.fullName = body.fullName
  }

  if (
    auth.user.usertype === Role.INSTITUTION &&
    body.institutionname
  ) {
    data.institutionname = body.institutionname
  }

  const updatedUser = await prisma.user.update({
    where: { id: auth.user.id },
    data,
    select: {
      id: true,
      email: true,
      username: true,
      fullName: true,
      institutionname: true,
      usertype: true,
    },
  })

  return NextResponse.json({
    message: "Profile updated",
    user: updatedUser,
  })
}

export async function DELETE() {
  const auth = await requireAuth()
  if ("error" in auth) return auth.error

  await prisma.user.delete({
    where: { id: auth.user.id },
  })

  return NextResponse.json({
    message: "Account deleted successfully",
  })
}