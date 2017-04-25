import {ResType} from "../enums/api-response-type";
export class ApiResponse {

  public type: ResType;
  public data: any;

  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
}