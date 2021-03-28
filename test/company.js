var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var expect = chai.expect;

chai.use(chaiHttp);

describe('company API', function () {
    describe('/GET companies', function () {
        it('Getting all companies', function (done) {
            chai.request(app).get('/companies').end(function (err, res) {
                expect(err).to.be.null;
                expect(res).not.to.be.empty;
                expect(res).to.have.status(200);
                const content = res.body
                expect(content).to.be.a('array');
                expect(content.length > 0).to.be.true;
                const firstItem = content[0];
                // const {name, unique_symbol, income, value, future, past, health, total, recentPrice } = content;
                expect(Object.keys(firstItem)).to.be.a('array');
                expect(Object.keys(firstItem).length).to.equal(10);
                Object.keys(firstItem).forEach(e => {
                    expect(['id', 'name', 'unique_symbol', 'income', 'value', 'future', 'past', 'health', 'total', 'recentPrice']).to.contain(e);
                });
                done();
            });
        });
        it('Getting by symbol', function (done) {
            const searchKey = 'NasdaqGS:MSFT';
            chai.request(app).get(`/companies?symbol=${searchKey}`).end(function (err, res) {
                expect(err).to.be.null;
                expect(res).not.to.be.empty;
                expect(res).to.have.status(200);
                const content = res.body
                expect(content).to.be.a('array');
                expect(content.length).to.equal(1);
                const firstItem = content[0];
                // const {name, unique_symbol, income, value, future, past, health, total, recentPrice } = content;
                expect(Object.keys(firstItem)).to.be.a('array');
                expect(Object.keys(firstItem).length).to.equal(10);
                Object.keys(firstItem).forEach(e => {
                    expect(['id', 'name', 'unique_symbol', 'income', 'value', 'future', 'past', 'health', 'total', 'recentPrice']).to.contain(e);
                    if (e === 'unique_symbol') {
                        expect(firstItem[e]).to.equal(searchKey);
                    }
                });
                done();
            });
        });
        it('Getting by score', function (done) {
            const searchKey = 13;
            chai.request(app).get(`/companies?score=${searchKey}`).end(function (err, res) {
                expect(err).to.be.null;
                expect(res).not.to.be.empty;
                expect(res).to.have.status(200);
                const content = res.body
                expect(content).to.be.a('array');
                expect(content.length).to.equal(2);
                const firstItem = content[0];
                // const {name, unique_symbol, income, value, future, past, health, total, recentPrice } = content;
                expect(Object.keys(firstItem)).to.be.a('array');
                expect(Object.keys(firstItem).length).to.equal(10);
                Object.keys(firstItem).forEach(e => {
                    expect(['id', 'name', 'unique_symbol', 'income', 'value', 'future', 'past', 'health', 'total', 'recentPrice']).to.contain(e);
                    if (e === 'total') {
                        expect(firstItem[e]).to.equal(searchKey);
                    }
                });
                content.forEach(e => {
                    expect(e['total']).to.equal(searchKey);
                });
                done();
            });
        });
        it('sort by score asc', function (done) {
            const sort = 'asc';
            chai.request(app).get(`/companies?sort_score=${sort}`).end(function (err, res) {
                expect(err).to.be.null;
                expect(res).not.to.be.empty;
                expect(res).to.have.status(200);
                const content = res.body
                expect(content).to.be.a('array');
                expect(content.length > 0).to.be.true;
                const firstItem = content[0];
                expect(Object.keys(firstItem)).to.be.a('array');
                expect(Object.keys(firstItem).length).to.equal(10);
                Object.keys(firstItem).forEach(e => {
                    expect(['id', 'name', 'unique_symbol', 'income', 'value', 'future', 'past', 'health', 'total', 'recentPrice']).to.contain(e);
                });
                let currentValue = -1;
                content.forEach(element => {
                    expect(element.total >= currentValue).to.be.true;
                    currentValue = element.total;
                });
            });
            done();
        });
        it('sort by score desc', function (done) {
            const sort = 'desc';
            chai.request(app).get(`/companies?sort_score=${sort}`).end(function (err, res) {
                expect(err).to.be.null;
                expect(res).not.to.be.empty;
                expect(res).to.have.status(200);
                const content = res.body
                expect(content).to.be.a('array');
                expect(content.length > 0).to.be.true;
                const firstItem = content[0];
                expect(Object.keys(firstItem)).to.be.a('array');
                expect(Object.keys(firstItem).length).to.equal(10);
                Object.keys(firstItem).forEach(e => {
                    expect(['id', 'name', 'unique_symbol', 'income', 'value', 'future', 'past', 'health', 'total', 'recentPrice']).to.contain(e);
                });
                let currentValue = content[0].total;
                content.forEach(element => {
                    expect(element.total <= currentValue).to.be.true;
                    currentValue = element.total;
                });
                done();
            });
        });
        it('sort by price fluctuations asc', function (done) {
            const sort = 'asc';
            chai.request(app).get(`/companies?sort_fluct=${sort}`).end(function (err, res) {
                expect(err).to.be.null;
                expect(res).not.to.be.empty;
                expect(res).to.have.status(200);
                const content = res.body
                expect(content).to.be.a('array');
                expect(content.length > 0).to.be.true;
                const firstItem = content[0];
                expect(Object.keys(firstItem)).to.be.a('array');
                expect(Object.keys(firstItem).length).to.equal(10);
                Object.keys(firstItem).forEach(e => {
                    expect(['id', 'name', 'unique_symbol', 'income', 'value', 'future', 'past', 'health', 'total', 'recentPrice']).to.contain(e);
                });
                done();
            });
        });

        
    });
});