type ErrorInfo = {
  err: string | Error;
  method: string;
  status?: number;
}

export const createError = (errorInfo: ErrorInfo) => {
  const { err, method, status = 500 } = errorInfo
  const isErrorObject = typeof err === 'object'

  return {
    log: `Error occurred in ${method}: ${isErrorObject ? JSON.stringify(err) : err}`,
    message: {
      error: isErrorObject ? 'An internal server error occurred' : err,
    },
    status,
  }
}
