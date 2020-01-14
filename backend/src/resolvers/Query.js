async function user(_, args, { binding }, info) {
  const user = await binding.query.user({ where: { id: args.id } }, info);
  return user;
}

module.exports = { user };
