const expect = require('chai').expect;
const sinon = require('sinon');
const thirdpartyServices = require('../../app/modules/thirdpartyservices')
const mockHttpReq = require('node-mocks-http')
const comment = require('../../app/models/comment');

const orgController = require('../../app/controllers/org.controller');

const mockRequest = (orgName, body) => {
    return {
        params: {'org': orgName },
        body: body
    };
};

const OrgCommentMock = function () {};
OrgCommentMock.prototype.save = function (data) {};
OrgCommentMock.prototype.find = function (data) {};
OrgCommentMock.prototype.updateMany = function () {};

var mockResponse = mockHttpReq.createResponse();

describe('=== org comments test', () => {

    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('invalid org name test', async() =>  {
        sandbox.stub(thirdpartyServices, 'findOrg').returns('xendit');
        var res = await orgController.create(mockRequest(''), mockResponse);
        expect(res.statusCode).to.equal(400);
    });

    it('orgname passed correct', async() =>  {   
        var findOrgStub = sandbox.stub(thirdpartyServices, 'findOrg').returns('xendit');
        var orgControllerSpy = sandbox.spy(orgController, 'create');
        OrgCommentMock.prototype.save = function() {
            return mockResponse;
        }
        orgControllerSpy.orgComment = OrgCommentMock;
        var res = await orgControllerSpy(mockRequest('xendit', {
        'comment': 'abc'
        }), mockResponse);
        //expect(mockResponse.statusCode).to.equal(200);
        expect(findOrgStub.calledOnce).to.be.true;
        expect(findOrgStub.getCall(0).args[0]).to.equal('xendit');
    });

    it('invalid body test', async() =>  {
        sandbox.stub(thirdpartyServices, 'findOrg').returns('xendit');
        var res = await orgController.create(mockRequest('xendit', ''), mockResponse);
        expect(res.statusCode).to.equal(400);
    });

    it('valid body test for save comment', async() =>  {
        sandbox.stub(thirdpartyServices, 'findOrg').returns('xendit');
        var orgControllerSpy = sandbox.spy(orgController, 'create');
        OrgCommentMock.prototype.save = function(data) {
            mockResponse.send = data;
            return mockResponse;
        }
        orgControllerSpy.orgComment = OrgCommentMock;
        var res = await orgControllerSpy(mockRequest('xendit', {
            'comment': 'abc'
        }), mockResponse);
        expect(mockResponse.statusCode).to.equal(400);
    });
})
