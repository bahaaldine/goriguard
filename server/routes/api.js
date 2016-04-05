/*var get_fields      = require('./common/get_fields.js'),
get_date_fields     = require('./common/get_date_fields.js'),
get_metric_fields   = require('./common/get_metric_fields.js'),
get_indices         = require('./common/get_indices.js'),
get_sdk             = require('./common/get_sdk.js'),

get_faces           = require('./faces/get_faces.js'),
get_face_by_id      = require('./faces/get_face_by_id.js'),
delete_faces_by_id  = require('./faces/delete_faces_by_id.js'),
create_face         = require('./faces/create_face.js'),
run_face            = require('./faces/run_face.js'),
stop_face           = require('./faces/stop_face.js'),
run_face_query      = require('./faces/run_face_query.js'),

get_prediction      = require('./prediction/api.js');
*/

var get_realms       = require('./realm/get_realms.js'),
get_realm_by_id      = require('./realm/get_realm_by_id.js'),
delete_realms_by_id  = require('./realm/delete_realms_by_id.js'),
update_realm         = require('./realm/update_realm.js'),
create_realm         = require('./realm/create_realm.js'),

get_users		       	= require('./user/get_users.js'),
get_user_by_id      = require('./user/get_user_by_id.js'),
delete_users_by_id  = require('./user/delete_users_by_id.js'),
update_user         = require('./user/update_user.js'),
create_user         = require('./user/create_user.js'),

get_roles		       	= require('./role/get_roles.js'),
get_role_by_id      = require('./role/get_role_by_id.js'),
delete_roles_by_id  = require('./role/delete_roles_by_id.js'),
update_role         = require('./role/update_role.js'),
create_role         = require('./role/create_role.js');

module.exports = function (server) {

  server = get_realm_by_id(server);
  server = get_realms(server);
  server = delete_realms_by_id(server);
  server = update_realm(server);
  server = create_realm(server);

  server = get_user_by_id(server);
  server = get_users(server);
  server = delete_users_by_id(server);
  server = update_user(server);
  server = create_user(server);

  server = get_role_by_id(server);
  server = get_roles(server);
  server = delete_roles_by_id(server);
  server = update_role(server);
  server = create_role(server);
}