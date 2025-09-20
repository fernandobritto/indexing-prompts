import { handler } from '@lambda/healthCheckHandler'
import { type APIGatewayProxyResult } from 'aws-lambda'

describe('HealthCheck Handler', (): void => {
  it('should return the healthCheck default response', async (): Promise<void> => {
    const result = {
      body: '{"ok, the gateway appears to be healthy"}',
      statusCode: 200
    }
    const response: APIGatewayProxyResult = await handler()

    expect(response.statusCode).toBeDefined()
    expect(response.statusCode).toEqual(result.statusCode)
    expect(response.body).toBeDefined()
    expect(response.body).toEqual(response.body)
  })
})
