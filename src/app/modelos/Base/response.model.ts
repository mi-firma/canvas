export class APIResponse<T> {
    status: string;
    statusCode: number;
    message: string;
    data: T;

    constructor(other: APIResponse<T>) {
        this.status = other.status;
        this.statusCode = other.statusCode;
        this.message = other.message;
        this.data = other.data;
    }

    get isSuccesful(): boolean {
        return this.statusCode === 200 || this.statusCode === 204 || this.statusCode === 201;
    }
}

export class APIResponse2<T> {
    status: string;
    status_code: number;
    message: string;
    data: T;

    constructor(other: APIResponse2<T>) {
        this.status = other.status;
        this.status_code = other.status_code;
        this.message = other.message;
        this.data = other.data;
    }

    get isSuccesful(): boolean {
        return this.status_code === 200 || this.status_code === 204 || this.status_code === 201;
    }
}
