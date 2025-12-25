export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;


    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // Marks this error as a trusted error (validation, 404, etc.) 
        // vs a bug (programming error)
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

};