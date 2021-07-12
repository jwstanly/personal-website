interface ApiExceptionData {
  message: string;
  [any: string]: any;
}

interface ApiExceptionConstructor {
  statusCode: number;
  res: string | ApiExceptionData;
}

export default class ApiException extends Error {
  public readonly statusCode: number;
  public readonly res: ApiExceptionData;

  constructor(error: ApiExceptionConstructor) {
    const res: ApiExceptionData =
      typeof error.res === 'string' ? { message: error.res } : error.res;

    super(res.message);

    Object.setPrototypeOf(this, ApiException.prototype);

    this.statusCode = error.statusCode;
    this.res = res;
  }
}
