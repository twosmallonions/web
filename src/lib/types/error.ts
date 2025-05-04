import type { components } from "./openapi";

export type HTTPValidationError = components['schemas']['HTTPValidationError'];

export interface ApiErrorResponse {
    error: string;
    detail?: any;
    id: string;
}