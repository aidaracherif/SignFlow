import { IApiPaginator } from "./Paginator";

export class ResponseApi {
    status?: string;
    payload?: any;
    message?: string;
    errors?: any;
    metadata?: IApiPaginator;
}