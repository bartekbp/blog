import express from 'express';
const router = express.Router();
import check from 'express-validator/check';
import authHandler from '../auth';

const {body, validationResult } = check;


const validators = [
  body('username').trim().isLength({ min: 1 }),
];

router.post('/', validators, function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  authHandler.login(req.body)
    .marshall(res, next);
});

export default router;
