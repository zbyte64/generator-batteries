import Waterline from 'waterline';

export var orm = new Waterline();

var User = Waterline.Collection.extend({
  identity: 'user',
  connection: 'myLocalDisk',

  attributes: {
    first_name: 'string',
    last_name: 'string',
    username: 'string',
    password_hash: 'string',
    email: 'email',
  }
});

orm.loadCollection(User);

/*
orm.initialize(config, function(err, models) {
*/

export function getUser(params) {
  return User.findOne(params)
}

export function updateUser(userId, userObj) {
  return User.where({id: userId})
}
