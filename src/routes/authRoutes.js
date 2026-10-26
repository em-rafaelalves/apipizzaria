import express from 'express';
import * as authController from '../controllers/authController.js';
 
const router = express.Router();
 
router.post('/', authController.login);
 
export default router;