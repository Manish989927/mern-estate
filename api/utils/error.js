function errorHandler(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.name = 'ErrorHandler'; // or you can use any other name you prefer
    return error;
}

export default errorHandler;
