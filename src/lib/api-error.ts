export class UserFacingError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = "UserFacingError";
    this.statusCode = statusCode;
  }
}

export function apiError(error: unknown, fallbackMessage: string = "An unexpected error occurred", fallbackStatus: number = 500) {
  if (error instanceof UserFacingError) {
    return Response.json({ error: error.message }, { status: error.statusCode });
  }
  
  if (error instanceof Error) {
    console.error(`[API Error]: ${error.message}`, error.stack);
  } else {
    console.error(`[API Error]:`, error);
  }
  
  return Response.json({ error: fallbackMessage }, { status: fallbackStatus });
}
