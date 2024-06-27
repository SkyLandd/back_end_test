import { InternalServerErrorException } from "@nestjs/common";

export class UnknownException extends InternalServerErrorException {
  constructor() {
    super({
      message: `Error occured while registering user. Try again after sometime!`,
    })
  }
}