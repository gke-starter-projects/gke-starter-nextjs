// app/api/signup/route.js
import { query } from '../../../db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

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
        { status: 400 }
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
      hashedPassword
    ]);

    // Return success response
    return NextResponse.json({ 
      message: 'User created successfully',
      user: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' }, 
      { status: 500 }
    );
  }
}