import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel';

export const createSuperadmin = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Superadmin tokeni tekshirish
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).json({ error: 'Authorization header is required.' });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(403).json({ error: 'Invalid authorization header format.' });
    }

    const superadminToken = tokenParts[1];
    const decodedToken = jwt.verify(superadminToken, 'superadmin_secret') as { role: string } | null;
    if (!decodedToken || decodedToken.role !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmin can create admin users.' });
    }

    // Admin yaratish
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      username,
      email,
      role: 'admin',
      password: hashedPassword
    });

    res.status(201).json({ message: 'Admin user created successfully.', admin });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Login funktsiyasi
export const login = async (req: Request, res: Response) => {
     const { username, password } = req.body;
   
     try {
       const user = await User.findOne({ where: { username } });
       if (!user) {
         return res.status(404).json({ error: 'User not found.' });
       }
   
       const passwordMatch = await bcrypt.compare(password, user.password);
       if (!passwordMatch) {
         return res.status(401).json({ error: 'Incorrect password.' });
       }
   
       const token = jwt.sign({ username: user.username, role: user.role }, 'jwt_secret', { expiresIn: '1h' });
       
       res.status(200).json({ message: 'Login successful.', user: { username: user.username, email: user.email, role: user.role }, token });
     } catch (error: any) {
       res.status(500).json({ error: error.message });
     }
   };
