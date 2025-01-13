'use server';

import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import query from '../../../db';
import validationSchema from '../../../schemas/signup';
import addCommonHeaders from '../common-options';
import { createJwtToken, setAuthTokenCookie } from '../../utils/jwt-serverside';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();

    try {
      // Validate the request body using the same schema
      const validationSchemaWithoutConfirm = validationSchema.omit(['confirmPassword']);
      await validationSchemaWithoutConfirm.validate(body, { abortEarly: false });
    } catch (validationError) {
      return NextResponse.json({
        message: 'Validation failed',
        errors: validationError.errors,
      }, { status: 400 });
    }

    const { username, email, password } = body;

    // Check if username or email already exists
    const checkUserQuery = `
      SELECT username, email
      FROM users
      WHERE username = $1 OR email = $2
    `;
    const existingUser = await query(checkUserQuery, [username, email]);

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: 'Username or email already exists' },
        { status: 400 },
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const insertUserQuery = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `;

    const result = await query(insertUserQuery, [
      username,
      email,
      hashedPassword,
    ]);

    // Create JWT token

    const user = result.rows[0];
    const token = await createJwtToken(user.id, user.username);

    // Create the response
    const response = NextResponse.json({
      message: 'User created successfully',
      user: result.rows[0],
    }, { status: 201 });

    // Set the cookie
    await setAuthTokenCookie(response, token);

    return response;
  } catch (error) {
    return NextResponse.json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 204 });
  addCommonHeaders(request, response);
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  return response;
}
