'use server';

const addCommonHeaders = (request, response) => {
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

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin);
  }
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Vary', 'Origin');
};

export default addCommonHeaders;
