export const badRequest = {
    code: 400,
    error0: "Bad Request.",
    error1: "Invalid Id.",
    error2: "Not Modified.",
    error3: "Not Deleted.",
    error4: "Undefined."
};

export const unauthorized = {
    code: 401,
    error0: "Unauthorized.",
    error1: "To create a workout is required have exercises.",
    error2: "Is required at least one exercise.",
    error3: "There are no copied exercises in your request body."
};

export const notFound = {
    code: 404,
    error0: "Not Found.",
    error1: "No registers.",
    error2: "Token not found."
};

export const conflict = {
    code: 409,
    error0: "Conflict.",
    error1: "Email have already registered."
};

export const authenticationTimeout = {
    code:419,
    error0: "Authentication Timeout."
};
