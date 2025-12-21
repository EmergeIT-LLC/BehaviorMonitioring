export interface BaseResponse {
    statusCode: number;
    serverMessage?: string;
    errorMessage?: string;
    messages?: string[];
}