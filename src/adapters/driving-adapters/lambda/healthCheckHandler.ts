import { formatResponse } from '@domain/config/helpers/formatResponse'
import { type APIGatewayProxyResult } from 'aws-lambda'

export async function handler(): Promise<APIGatewayProxyResult> {
  return await formatResponse(200, {
    message: 'OK, the gateway appears to be healthy'
  })
}
