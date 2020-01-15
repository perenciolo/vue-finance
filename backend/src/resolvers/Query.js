const moment = require('moment');

const { getUserId } = require('./../../utils');

const { PRISMA_SERVICE, PRISMA_STAGE } = process.env;

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

async function totalBalance(_, { date }, { prisma, request }, info) {
  const userId = getUserId(request);
  const dateISO = moment(date, 'YYYY-MM-DD')
    .endOf('day')
    .toISOString();
  // Database schema name.
  const dbSchema = `${PRISMA_SERVICE}$${PRISMA_STAGE}`;
  const table = 'Record';
  const pivotTable = '_RecordToUser';
  const mutation = `
    mutation TotalBalance($database: PrismaDatabase, $query: String!){
      executeRaw(database: $database, query: $query)
    }
  `;
  const variables = {
    database: 'default',
    query: `
      SELECT SUM("${dbSchema}"."${table}"."amount") as totalBalance
			 FROM "${dbSchema}"."${table}"

       INNER JOIN "${dbSchema}"."${pivotTable}"
       ON "${dbSchema}"."${pivotTable}"."A" = "${dbSchema}"."${table}"."id"

       WHERE "${dbSchema}"."${pivotTable}"."B" = '${userId}'
       AND "${dbSchema}"."${table}"."date" <= '${dateISO}'
    `
  };

  const response = await prisma.$graphql(mutation, variables);
  const totalBalance =
    response && response.executeRaw.length
      ? response.executeRaw[0].totalbalance
      : 0;

  return totalBalance;
}

async function user(_, args, { binding, request }, info) {
  const userId = getUserId(request);
  const user = await binding.query.user({ where: { id: userId } }, info);
  return user;
}

module.exports = { accounts, categories, records, totalBalance, user };
