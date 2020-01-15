const moment = require('moment');

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
function records(
  _,
  { month, type, accountsIds, categoriesIds },
  { binding, request },
  info
) {
  const userId = getUserId(request);

  let AND = [{ user: { id: userId } }];
  AND = !type ? AND : [...AND, { type }];
  AND =
    !accountsIds || accountsIds.length === 0
      ? AND
      : [...AND, { OR: accountsIds.map(id => ({ account: { id } })) }];
  AND =
    !categoriesIds || categoriesIds.length === 0
      ? AND
      : [...AND, { OR: categoriesIds.map(id => ({ category: { id } })) }];

  if (month) {
    const date = moment(month, 'MM-YYYY');
    const startDate = date.startOf('month').toISOString();
    const endDate = date.endOf('month').toISOString();
    AND = [...AND, { date_gte: startDate }, { date_lte: endDate }];
  }

  return binding.query.records(
    {
      where: { AND },
      orderBy: 'date_ASC'
    },
    info
  );
}

async function user(_, args, { binding, request }, info) {
  const userId = getUserId(request);
  const user = await binding.query.user({ where: { id: userId } }, info);
  return user;
}

module.exports = { accounts, categories, records, user };
