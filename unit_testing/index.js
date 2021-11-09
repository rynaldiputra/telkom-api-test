
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../src/models/user');

chai.use(chaiHttp);
chai.should();

const userPrefixUrl = '/api/v1/user';
const bookPrefixUrl = '/api/v1/book';

describe("User", async () => {
    // let data = await User.findAll({});
    // console.log(data)
    // beforeEach((done) => {
    //     data.destroy({truncate: true}, (err) => {
    //         done();
    //     });
    // });
    describe("POST /", () => {
        it("Should successfully register user", (done) => {
            let data = {
                username: "rynaldiputra",
                email: "rynaldiputra@gmail.com",
                password: "test123",
                confirmPassword: "test123"
            };

            chai.request(app)
                .post(`${userPrefixUrl}/register`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.a('object');
                    done();
                });
        });
        it("Should successfully login", (done) => {
            let data = {
                email: "rynaldiputra@gmail.com",
                password: "test123"
            };
            
            chai.request(app)
                .post(`${userPrefixUrl}/login`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.a('object');
                    done();
                })
        })
    });
    describe("FailedPOST /", () => {
        it("Should be string", (done) => {
            let dataErrorCase = {
                username: 123,
                email: 123,
                password: 123,
                confirmPassword: 123
            };

            chai.request(app)
                .post(`${userPrefixUrl}/register`)
                .send(dataErrorCase)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it("Should not be empty", (done) => {
            let dataErrorCase = {
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            };

            chai.request(app)
                .post(`${userPrefixUrl}/register`)
                .send(dataErrorCase)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
    });
});

describe("Book", async () => {
    describe("GET /", () => {
        it("Should get all books", (done) => {
            let data = {
                email: "rynaldiputra@gmail.com",
                password: "test123"
            };
            
            chai.request(app)
                .post(`${userPrefixUrl}/login`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.a('object');
                    res.body.should.have.property('token');
                    var token = res.body.token;
                    
                    chai.request(app)
                    .get(`${bookPrefixUrl}/get`)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.a('object');
                        done();
                    })
                });
        });
        it("Should get the chosen book", (done) => {
            let data = {
                email: "rynaldiputra@gmail.com",
                password: "test123"
            };
            
            chai.request(app)
                .post(`${userPrefixUrl}/login`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.a('object');
                    res.body.should.have.property('token');
                    var token = res.body.token;
                    
                    chai.request(app)
                    .get(`${bookPrefixUrl}/get/1`)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.a('object');
                        done();
                    })
                });
        });
    });
});
