const { getUserId } = require('./../../utils');

function accounts(_, args, { binding, request }, info) {
  const userId = getUserId(request);
  return binding.query.accounts(
    {
      where: {
        OR: [{ user: { id: userId } }, { user: null }]
      },
      orderBy: 'description_ASC'
    },
    info
  );
}

function categories(_, { operation }, { binding, request }, info) {
  const userId = getUserId(request);

  let AND = [
    {
      OR: [{ user: { id: userId } }, { user: null }]
    }
  ];

  AND = !operation ? AND : [...AND, { operation }];

  return binding.query.categories(
    {
      where: { AND },
      orderBy: 'description_ASC'
    },
    info
  );
}

async function user(_, args, { binding, request }, info) {
  const userId = getUserId(request);
  const user = await binding.query.user({ where: { id: userId } }, info);
  return user;
}

module.exports = { accounts, categories, user };
