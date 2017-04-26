import {ResType} from "../enums/api-response-type";

export class ApiResponse {

  public type: ResType;
  public data: any;

  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
}

export class ApiResponseSuccess extends ApiResponse {
  constructor(data: any) {
    super(ResType.SUCCESS, data);
  }
}

export class ApiResponseNotFound extends ApiResponse {
  constructor(optional_description?: String) {
    super(ResType.NOT_FOUND, optional_description || null);
  }
}

export class ApiResponseTryLater extends ApiResponse {
  constructor(seconds_to_wait) {
    super(ResType.TRY_LATER, seconds_to_wait);
  }
}

export class ApiResponseError extends ApiResponse {
  constructor(error: String) {
    super(ResType.ERROR, error);
  }
}