import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@/app/generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { signupSchema, AuthResponse } from "@/app/lib/auth-types";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET ?? "fallback-secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET ?? "fallback-refresh-secret";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate with Zod
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const { firstname, lastname, email, username, password, usertype, institutionname } =
      validation.data;

    // Check email
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      return NextResponse.json(
        {
          message: "Email already registered",
          errors: [{ field: "email", message: "Email already registered" }],
        },
        { status: 409 }
      );
    }

    // Check username
    const usernameExists = await prisma.user.findUnique({ where: { username } });
    if (usernameExists) {
      return NextResponse.json(
        {
          message: "Username already taken",
          errors: [{ field: "username", message: "Username already taken" }],
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const securityId = crypto.randomUUID();

    const newUser = await prisma.user.create({
      data: {
        fullName: `${firstname} ${lastname}`,
        email,
        username,
        password: hashedPassword,
        securityId,
        usertype: usertype as Role,
        institutionname: usertype === "INSTITUTION" ? institutionname : null,
      },
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: newUser.id, securityId: crypto.randomUUID() },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        message: "User created successfully",
        token,
        refreshToken,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
      },
      { status: 201 }
    );

    // Cookies
    response.headers.append(
      "Set-Cookie",
      serialize("accessToken", token, {
        httpOnly: true,
        path: "/",
        maxAge: 900,
      })
    );

    response.headers.append(
      "Set-Cookie",
      serialize("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      })
    );

    return response;
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
}
