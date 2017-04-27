import {ResType} from "../enums/api-response-type";

export class ApiResponse<Td, Te, Tw> {

  public type:  ResType;
  public data:  Td;
  public error: Te;
  public wait:  Tw;

  constructor(type, data, error, wait) {
    this.type =   type;
    this.data =   data;
    this.error =  error;
    this.wait =   wait;
  }
}

export class ApiResponseSuccess<T> extends ApiResponse<T, any, any> {
  constructor(data: T) {
    super(ResType.SUCCESS, data, null, null);
  }
}

export class ApiResponseError<T> extends ApiResponse<any, T, any> {
  constructor(error: T) {
    super(ResType.ERROR, null, error, null);
  }
}

export class ApiResponseTryLater<T> extends ApiResponse<any, any, T> {
  constructor(seconds_to_wait: T) {
    super(ResType.TRY_LATER, null, null, seconds_to_wait);
  }
}

export class ApiResponseNotFound extends ApiResponse<any, any, any> {
  constructor() {
    super(ResType.NOT_FOUND, null, null, null);
  }
}