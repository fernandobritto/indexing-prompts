export async function formatResponse(
  statusCode: number,
  response: Record<string, unknown>
): Promise<{
  statusCode: number
  headers: Record<string, string>
  body: string
}> {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(response)
  }
}
