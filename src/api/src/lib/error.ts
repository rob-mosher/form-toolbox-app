type ErrorInfo = {
  err: string | Error;
  method: string;
  status?: number;
}

export const createError = (errorInfo: ErrorInfo) => {
  const { err, method, status = 500 } = errorInfo
  return {
    log: `${method} error: ${typeof err === 'object' ? JSON.stringify(err) : err}`,
    message: { err: `Error occurred in ${require.main!.filename}.${method}. Check server logs for more details.` },
    status,
  }
}
