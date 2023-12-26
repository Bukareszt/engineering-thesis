import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { UsersModule } from '../domains/users/usersModule';

const userInput = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(3, 'Password must be at least 3 characters')
});

export const usersRouter = ({ usersModule }: { usersModule: UsersModule }) => {
  const router = Router();

  router.post('/register', async (req, res) => {
    const user = userInput.parse(req.body);
    try {
      await usersModule.createUser(user.username, user.password);
      res.sendStatus(204);
    } catch (e: any) {
      res.status(400).json(e.message);
    }
  });

  router.post('/login', async (req, res) => {
    const user = userInput.parse(req.body);
    try {
      const isValidPassword = await usersModule.verifyPassword(
        user.username,
        user.password
      );
      if (!isValidPassword) {
        res.sendStatus(401);
        return;
      }
      const token = jwt.sign({ username: user.username }, 'secretKey', {
        expiresIn: '7d'
      });
      res.status(200).json({ token });
    } catch (e) {
      res.sendStatus(401);
    }
  });

  return router;
};
