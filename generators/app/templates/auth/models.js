var knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

/*
//use this for tests
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  }
});
*/

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
