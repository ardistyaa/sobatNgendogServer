import { formatError } from '../utils/responseFormatter';

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(formatError(err.message || 'Internal Server Error'));
};
