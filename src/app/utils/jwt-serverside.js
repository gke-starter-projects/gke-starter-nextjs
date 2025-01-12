'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const AUTH_TOKEN_COOKIE_KEY = 'auth_token';
const JWT_EXPIRATION_TIME = '1h'; // 1 hour
const COOKIE_EXPIRATION_TIME = 1 * 60 * 60; // 1 hour (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)

export const createJwtToken = async (userId, userName) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({
    userId,
    userName,
    iat: Date.now(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRATION_TIME)
    .sign(secret);

  return token;
};

export const verifyJwtToken = async (request = null) => {
  let token = null;
  if (request) {
    token = request.cookies.get(AUTH_TOKEN_COOKIE_KEY)?.value;
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(AUTH_TOKEN_COOKIE_KEY)?.value;
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload: { userId, userName } } = await jwtVerify(token, secret);
  return { userId, userName };
};

export const setAuthTokenCookie = async (response, token) => {
  response.cookies.set({
    name: AUTH_TOKEN_COOKIE_KEY,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_EXPIRATION_TIME,
    path: '/',
  });
};
