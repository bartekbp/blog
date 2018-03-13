import express from 'express';
const router = express.Router();
import carsHandler from '../cars';

router.get('/csv', function(req, res, next) {
  carsHandler.csv()
    .marshall(res, next);
});

export default router;
