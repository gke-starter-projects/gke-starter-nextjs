'use server';

import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import * as yup from 'yup';
import query from '../../../db';
import addCommonHeaders from '../common-options';

// Create login validation schema
const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();

    try {
      // Validate the request body
      await loginSchema.validate(body, { abortEarly: false });
    } catch (validationError) {
      return NextResponse.json({
        message: 'Validation failed',
        errors: validationError.errors,
      }, { status: 400 });
    }

    const { email, password } = body;

    // Query for user by email
    const findUserQuery = `
      SELECT id, username, email, password
      FROM users
      WHERE email = $1
    `;
    const userResult = await query(findUserQuery, [email]);

    // Check if user exists
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const user = userResult.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    // Create the response
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    }, { status: 200 });

    // Set the cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

export function OPTIONS(request) {
  const response = new NextResponse(null, { status: 204 });
  addCommonHeaders(request, response);
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  return response;
}