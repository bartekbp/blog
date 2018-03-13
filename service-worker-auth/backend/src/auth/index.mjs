import jwt from 'jsonwebtoken';
import buffer from 'buffer';

import ErrorResponse from '../ErrorResponse';
import JsonResponse from '../JsonResponse';
import secretKey from '../config/secret_key';

const allowedUsers = ['Test'];
const jwtExpireTime = () => Math.floor(Date.now() / 1000) + 10 * 60;

class AuthHandler {
  login(body) {
    const { username } = body;
    if(!allowedUsers.includes(username)) {
      return new ErrorResponse(400, {reason: 'Bad username'});
    }

    const token = jwt.sign({
      exp: jwtExpireTime(),
      permissions: ['cars:read'],
      subject: username,
    }, buffer.Buffer.from(secretKey.k, 'base64'));

    return new JsonResponse(200, {token,});
  }
}

export default new AuthHandler();