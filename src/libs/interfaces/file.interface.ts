export interface IFile {
  dataBuffer: Buffer;

  fileName: string;

  fileSize?: number;

  contentType: string;
}
