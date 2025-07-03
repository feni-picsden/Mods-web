import express from 'express';
import { submitContactForm } from '../controllers/contact.controller.js';
import apiKeyAuth from '../middleware/apiKeyAuth.js';

const router = express.Router();

router.post('/submit', apiKeyAuth, submitContactForm);

export default router; 