import chai from 'chai';
import request from 'supertest';
import { Login } from '../utils/login';
import app from '..';

const { expect, assert } = chai;
const role = { role: 'test', path: '/test', method: 'GET' };

describe('User roles positive tests', () => {
  const authed = new Login();
  let token;

  before(async () => {
    await authed.setToken();
    token = authed.getToken();
  });
  after(async () => {
    await authed.destroyToken();
  });

  it('should create a user role', (done) => {
    request(app)
      .post('/userRole')
      .send(role)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal(`policy created`);
        done();
      });
  });
  it('should get all user roles', (done) => {
    request(app)
      .get(`/userRole`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.isObject(res.body, 'body is an object');
        done();
      });
  });
  it('should delete a user role', (done) => {
    request(app)
      .post(`/userRole/delete`)
      .send(role)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal(`policy deleted`);
        done();
      });
  });
});

describe('User role negative tests', () => {
  it('should not create a user role', (done) => {
    request(app)
      .post('/userRole')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal('Invalid input')
        done();
      });
  });
  it('should not delete a user', (done) => {
    request(app)
      .post(`/userRole/delete`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal(`Invalid input`);
        done();
      });
  });
});