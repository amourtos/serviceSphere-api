export enum ApiResponseStatus {
  SUCCESS = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  SERVICE_UNAVAILABLE = 503,
  SERVER_ERROR = 500
}

export type ApiResponseCode = keyof typeof ApiResponseStatus;
