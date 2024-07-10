import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is required.' });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res
      .status(401)
      .json({ error: 'Invalid authorization header format.' });
  }

  const token = tokenParts[1];

  jwt.verify(token, 'jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token expired or invalid.' });
    }
    next();
  });
};

export const checkSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ error: 'Authorization header is required.' });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res
      .status(403)
      .json({ error: 'Invalid authorization header format.' });
  }

  const superadminToken = tokenParts[1];
  try {
    const decodedToken = jwt.verify(superadminToken, 'superadmin_secret') as {
      role: string;
    } | null;
    if (!decodedToken || decodedToken.role !== 'superadmin') {
      return res
        .status(403)
        .json({ error: 'Only superadmin can create admin users.' });
    }
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

export default checkAuth;
