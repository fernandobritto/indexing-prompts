export interface IPromptRepository {
  getPromptById(promptId: string): Promise<any>
  createPrompt(promptData: any): Promise<any>
  updatePrompt(promptId: string, promptData: any): Promise<any>
  deletePrompt(promptId: string): Promise<any>
}
