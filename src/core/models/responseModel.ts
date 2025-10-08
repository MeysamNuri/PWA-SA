export interface IResponse<T> {
    RequestUrl: string;
    Data: T;
    Message: string[];
    Status: boolean;
    HttpStatusCode: number;
}

export interface ApiError {
    statusCode: number;
    message: string;
    details?: string[];
  }