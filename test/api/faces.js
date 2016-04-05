var server = require("./server");
var Http = require("http");

const expect = require('Code').expect;
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const sinon = require('sinon');
const describe = lab.experiment;
const it = lab.it;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const domain = "localhost";
const port = 5601;


var Promise = require('bluebird');

var listFaces = require("../../server/lib/list_faces");
var facesList = require("./data/faces.json");

var getFaceById = require("../../server/lib/get_face_by_id");
var face        = require("./data/face.json");

describe("faces api", function() {
    var listFacesStub, getFaceByIdStub;

    beforeEach(function(done) {
        /*listFacesStub = sinon.stub(listFaces, "listFaces", function() {
            return function() {
                return Promise.resolve(facesList.hits);
            }
        });*/

        getFaceByIdStub = sinon.stub(getFaceById, "getFaceById", function(server, req) {
            return function() {
                return Promise.resolve(face);
            }
        });

        done();
    });

    afterEach(function(done) {
        //listFacesStub.restore();
        getFaceByIdStub.restore();
        done();
    });

    it("should list faces", (done) => {            
        /*var options = {
            method: "GET",
            url: "/facechimp/faces"
        };


        server.inject(options, function(response) {
            var result = response.result;
            expect(response.statusCode).to.equal(200);
            expect(result).to.be.instanceof(Array);
            expect(result).to.have.length(10);

            done();
    
        });*/

        var options = {
            hostname: 'localhost',
            port: 5601,
            path: '/facechimp/faces',
            method: 'GET'
        };

        var req = Http.get(options, function (response) { 
            expect(response.statusCode).to.equal(200);
            console.log(response);
        });

    });

    it("should get a face from identifier", (done) => {            
        var id = "be748bc4-98bf-4df6-b470-3ab4095a0082";
        
        var options = {
            method: 'GET',
            url: '/facechimp/face/'+id
        };

        server.inject(options, function(response) {
            var result = response.result;
            expect(response.statusCode).to.equal(200);
            expect(result).to.be.instanceof(Object);
            expect(result._id).to.equal(id);

            done();
    
        });
    });
});