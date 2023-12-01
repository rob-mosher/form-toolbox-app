const createError = (errInfo) => {
  const { err, method, status } = errInfo;
  return {
    log: `${method} error: ${typeof err === 'object' ? JSON.stringify(err) : err}`,
    message: { err: `Error occurred in ${require.main.filename}.${method}. Check server logs for more details.` },
    status: status ?? 500,
  };
};

module.exports = {
  createError,
};
