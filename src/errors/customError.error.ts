import { CustomError } from "../models/customError.model";

export class UnauthorizedError extends CustomError{
  constructor() {
    super("Unauthorized", 401);
  };
};

export class NotFoundError extends CustomError{
  constructor(message: string) {
    super(message, 404);
  };
};