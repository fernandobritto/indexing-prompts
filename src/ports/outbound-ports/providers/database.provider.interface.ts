import {
  DeleteCommandInput,
  DeleteCommandOutput,
  GetCommandInput,
  GetCommandOutput,
  PutCommandInput,
  PutCommandOutput,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommandInput,
  ScanCommandOutput,
  UpdateCommandInput,
  UpdateCommandOutput
} from '@aws-sdk/lib-dynamodb'

export interface IDatabaseProvider {
  getOne(params: GetCommandInput): Promise<GetCommandOutput>
  getMany(params: QueryCommandInput): Promise<QueryCommandOutput>
  findOne(params: ScanCommandInput): Promise<ScanCommandOutput>
  create(params: PutCommandInput): Promise<PutCommandOutput>
  updateOne(params: UpdateCommandInput): Promise<UpdateCommandOutput>
  deleteOne(params: DeleteCommandInput): Promise<DeleteCommandOutput>
}
