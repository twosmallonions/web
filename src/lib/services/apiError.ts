import type { ApiErrorResponse, HTTPValidationError } from "$lib/types/error";

export class ApiErrorDescription {
    humanDescription: string;
    description: string;
    rawError?: any;
    statusCode: number

    constructor(humanDescription: string, description: string, statusCode: number, rawError?: any) {
        this.humanDescription = humanDescription;
        this.description = description;
        this.rawError = rawError;
        this.statusCode = statusCode;
    }
}

export class ApiBadRequestError extends ApiErrorDescription {
    constructor(error: ApiErrorResponse) {
        super(`Error while processing request: ${error.error}`, error.id, 400);
    }
}

export class ApiNotFoundError extends ApiErrorDescription {
    constructor(path: string) {
        super(`The resource at ${path} could not be found`, 'not_found', 404);
    }
}

export class ApiValidationError extends ApiErrorDescription {
    error: HTTPValidationError;
    constructor(error: HTTPValidationError, statusCode: number) {
        super('The object could not be validated', 'validation_error', statusCode, error);
        this.error = error;
    }
}

export class ApiUnknownError extends ApiErrorDescription {
    constructor(statusCode: number) {
        super(`An unknown error occured (HTTP Status Code ${statusCode})`, 'unknown_error', statusCode);
    }
}

export class ApiError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}
