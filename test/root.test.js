const supertest = require('supertest');
const app = require('../app');
const chai = require('chai');
const { assert } = require("chai");

describe('Testing root of project', () =>{
    
    it("should return a 200 status code" , () => {
        supertest(app)
        .get('/')
        .expect(200)
        .end((err, res) => {
            if(err)
            console.log(err);
        });
    });
    it("should return a Hello world response", () => {
        supertest(app)
        .get('/')
        .expect(200)
        .end((err, res) => {
            if (err) console.log(err);

            assert.equal(res.body.message, "Hello world");
        });
    });
});