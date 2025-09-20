import { IIntegrationsProvider } from '@domain/infra/providers/integrations/integrations.provider.interface'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export class AxiosProvider implements IIntegrationsProvider {
  private readonly instance: AxiosInstance

  constructor(baseUrl: string, token: string) {
    this.instance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  }

  private async makeRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    config = {
      ...config,
      method,
      url: endpoint
    }

    if (data) {
      config.data = data
    }

    try {
      const response = await this.instance.request<T>(config)
      return response
    } catch (error) {
      console.error(`Error on ${method.toUpperCase()} request to ${endpoint}:`, error)
      throw error
    }
  }

  async getIntegration<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.makeRequest<T>('get', endpoint, null, config)
  }
}
