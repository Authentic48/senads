import { IFile } from '../../libs/interfaces/file.interface';

export interface IFileService {
  uploadFile({ dataBuffer, fileName, contentType }: IFile): Promise<string>;
}
