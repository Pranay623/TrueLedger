import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { signinSchema } from "@/app/lib/auth-types";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET ?? "fallback-secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET ?? "fallback-refresh-secret";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    //  Validate input
    const validation = signinSchema.safeParse(body);
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


    //  Find user
    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
          errors: [{ field: "email", message: "Invalid credentials" }],
        },
        { status: 401 }
      );
    }

    //  Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
          errors: [{ field: "password", message: "Invalid credentials" }],
        },
        { status: 401 }
      );
    }

    //  Generate tokens
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
        usertype: user.usertype,
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        securityId: user.securityId,
      },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Response
    const response = NextResponse.json(
      {
        message: "Signin successful",
        token,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          usertype: user.usertype,
          admin: user.admin,
        },
      },
      { status: 200 }
    );

    // Set cookies
    response.headers.append(
      "Set-Cookie",
      serialize("accessToken", token, {
        httpOnly: true,
        path: "/",
        maxAge: 15 * 60,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    );

    response.headers.append(
      "Set-Cookie",
      serialize("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    );

    return response;
  } catch (error) {
    console.error("Signin Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
