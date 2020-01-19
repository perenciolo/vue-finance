const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const moment = require('moment');

const { getUserId } = require('./../../utils');

function createAccount(_, { description }, { binding, request }, info) {
  const userId = getUserId(request);
  return binding.mutation.createAccount(
    {
      data: {
        description,
        user: {
          connect: {
            id: userId
          }
        }
      }
    },
    info
  );
}

function createCategory(
  _,
  { description, operation },
  { binding, request },
  info
) {
  const userId = getUserId(request);
  return binding.mutation.createCategory(
    {
      data: {
        description,
        operation,
        user: {
          connect: {
            id: userId
          }
        }
      }
    },
    info
  );
}

function createRecord(
  _,
  { accountId, categoryId, amount, type, date, description, tags, note },
  { binding, request },
  info
) {
  const _date = moment(date);
  if (!_date || !_date.isValid()) {
    throw new Error('Invalid date');
  }

  if ((type === 'DEBIT' && amount > 0) || (type === 'CREDIT' && amount < 0)) {
    amount = -amount;
  }

  const userId = getUserId(request);
  return binding.mutation.createRecord(
    {
      data: {
        user: {
          connect: { id: userId }
        },
        account: {
          connect: { id: accountId }
        },
        category: {
          connect: { id: categoryId }
        },
        amount,
        type,
        date,
        description,
        tags,
        note
      }
    },
    info
  );
}

async function signin(_, { email, password }, { binding }, info) {
  const user = await binding.query.user({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    {
      userId: user.id
    },
    JWT_SECRET,
    {
      expiresIn: '2h'
    }
  );

  return { token, user };
}

async function signup(_, args, { binding }, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await binding.mutation.createUser({
    data: { ...args, password }
  });
  const token = jwt.sign(
    {
      userId: user.id
    },
    JWT_SECRET,
    {
      expiresIn: '2h'
    }
  );

  return { token, user };
}

module.exports = {
  createAccount,
  createCategory,
  createRecord,
  signin,
  signup
};
