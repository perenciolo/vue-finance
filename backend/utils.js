const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

function getUserId(request) {
  // "Authorization": "Bearer <token_jwt>".
  const Authorization = request.get('Authorization');

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, JWT_SECRET);

    return userId;
  }

  throw new Error('Not authenticated.');
}

module.exports = { getUserId };
