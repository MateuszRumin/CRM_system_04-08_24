import express from 'express';
import { sendInvoiceEmail } from '../modules/sendEmailAttachment/sendEmialAttachmentController';

const router = express.Router();

router.post('/send-invoice-email', sendInvoiceEmail);

// Obsługa błędnych ścieżek
router.use('/', (req, res, next) => {
  const logger = req.app.get('logger');
  logger.error('Próba połączenia z nieobsługiwaną ścieżką e-mail');
  res.status(404).json({ error: 'Nieobsługiwana ścieżka e-mail' });
});

module.exports = router;
