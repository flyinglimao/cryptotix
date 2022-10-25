export class ExternalServiceError extends Error {
  name: "ExternalServiceError"
  statusCode: "503"
  constructor(message?: string) {
    super(message)
  }
}
