const malformedJSONErrorHandling = (err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    'body' in err
  ) {
    console.error('Malformed JSON body:', err.message);

    return res.status(400).json({
      message: 'Malformed request.'
    });
  }
  return next(err);
};

module.exports = malformedJSONErrorHandling;