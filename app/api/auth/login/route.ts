import { NextRequest, NextResponse } from "next/server";
import { login } from "@/services/database/users";
import * as jose from "jose";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Note: Using plaintext passwords is insecure. Use a library like bcrypt.
    const userArray = await login(email, password);
    const user = userArray[0];

    // Create JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-super-secret-jwt-key-with-at-least-32-characters");
    const alg = "HS256";

    const jwt = await new jose.SignJWT({
      id: user.id,
      email: user.email,
      name: user.full_name,
    })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .setIssuedAt()
      .setSubject(user.id)
      .sign(secret);

    // Set cookie
    const response = NextResponse.json({ user });
    response.cookies.set("session", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    const err = error as Error;
    if (err.message.includes("Invalid email or password")) {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
