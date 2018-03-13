import express from 'express';
import buffer from 'buffer';
import logger from 'morgan';
import bodyParser from 'body-parser';
import auth from './routes/auth';
import cars from './routes/cars';
import jwt from 'express-jwt';
import Guard from 'express-jwt-permissions';
import secretKey from './config/secret_key';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use('/auth', auth);
app.use('/cars', jwt({ secret: buffer.Buffer.from(secretKey.k, 'base64')}), Guard().check('cars:read'), cars);

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  if(err.name === 'UnauthorizedError') {
    if (err.code === 'credentials_required') {
      res.status(401).json({reason: 'Missing token'});
      return;
    }

    if (err.code === 'permission_denied') {
      res.status(403).send({reason: 'Forbidden'});
      return;
    }

    if (err.code === 'invalid_token') {
      res.status(403).send({reason: 'Token expired'});
      return;
    }
  }

  res.status(err.status || 500);
  const { stack, message } = err;
  res.json(req.app.get('env') === 'development' ? {stack, message, } : {});
});

export default app;
