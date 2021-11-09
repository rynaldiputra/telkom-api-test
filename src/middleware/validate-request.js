module.exports = validateRequest;

function validateRequest(res, req, next, schema, method = '') {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        // next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        return res.status(400).json({ message: `${error.details.map(x => x.message).join(', ')}`, errorMessage: `${method} Failed`, status: false })
    } else {
        req.body = value;
        next();
    }
}