import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import crypto from 'crypto'

const securityHeadersMiddleware = () => {
  const after = async (request: { event: APIGatewayProxyEvent; response: APIGatewayProxyResult; context: Context }) => {
    const nonce = crypto.randomBytes(16).toString('base64'); 

    request.response.headers = {
      ...request.response.headers,
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Frame-Options': 'DENY',  
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': 
        `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}'; frame-ancestors 'none'; base-uri 'none'; require-trusted-types-for 'script';`,
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
  }
  return {
    after
  }
}

export default securityHeadersMiddleware;