import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import query from '../../../db';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { username, email, password } = body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

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

    // Return success response
    return NextResponse.json({
      message: 'User created successfully',
      user: result.rows[0],
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}

export function OPTIONS(request) {
  // Extract the origin of the request
  const requestOrigin = request.headers.get('Origin');

  // Define the allowed origins
  const allowedOrigins = [
    'http://localhost',
    /\.cluster\.ad-absurdum\.me$/,
  ];

  // Check if the request origin is in the allowed list
  const isAllowedOrigin = allowedOrigins.some((origin) => {
    if (typeof origin === 'string') {
      return origin === requestOrigin;
    }
    return origin.test(requestOrigin);
  });

  // Create a response
  const response = new NextResponse(null, { status: 204 });

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin);
  }
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Vary', 'Origin');

  return response;
}
