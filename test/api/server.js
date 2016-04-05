var Hapi = require("hapi"),
		elasticsearch = require('elasticsearch'),
		Joi = require("Joi");

var server = new Hapi.Server();
server.connection({ port: 3000 });

var get_faces = require("../../server/routes/faces/get_faces");
var get_face_by_id = require("../../server/routes/faces/get_face_by_id");

server = get_faces(server);

module.exports = server;