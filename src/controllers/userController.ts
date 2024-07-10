import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel';

export const createAdmin = async (req: Request, res: Response) => {
     const { username, email, password } = req.body;
   
     try {
       const hashedPassword = await bcrypt.hash(password, 10);
       const admin = await User.create({
         username,
         email,
         role: 'admin',
         password: hashedPassword,
       });
   
       res.status(201).json({ message: 'Admin user created successfully.', admin });
     } catch (error: any) {
       res.status(500).json({ error: error.message });
     }
   };

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

    const token = jwt.sign(
      { username: user.username, role: user.role },
      'jwt_secret',
      { expiresIn: '1h' }
    );

    res
      .status(200)
      .json({
        message: 'Login successful.',
        user: { username: user.username, email: user.email, role: user.role },
        token,
      });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

