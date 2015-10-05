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
    email: 'string',
  }
});

orm.loadCollection(User);

/*
orm.initialize(config, function(err, models) {
*/

export function getUser(params) {

}

export function updateUser(userId, userObj) {

}
