// handle error or make a possible error
export const handleMakeError = (statusCode, message) => {
    const error = new Error()
    error.statusCode = statusCode
    error.message = message 
    return error 
} 