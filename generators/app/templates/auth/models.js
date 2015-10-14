var knex = require('knex')(require('./knexfile')[process.env.ENVIRONMENT || 'development']);

var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: 'users'
});

export function getUser(params) {
  return User.where(params).fetchOne()
}

export function updateUser(userId, userObj) {
  userObj.id = userId; //awkward
  return User.forge(userObj).save();
}
