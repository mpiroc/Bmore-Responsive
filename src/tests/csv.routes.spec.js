import request from 'supertest';
import { Login } from '../utils/login';
import app from '..';

describe('CSV Dump Positive Tests', () => {
    const authed = new Login();
    let token;

    before(async () => {
        await authed.setToken();
        token = authed.getToken();
    });
    after(async() => {
        await authed.destroyToken();
    });

    it('Positive Test for CSV Dump on Entity', (done) => {
        request(app)
            .get('/csv/Entity')
            .set('Accept', 'application/json')
            .set('token', token)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200)
        .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('Positive Test for CSV Dump on Contact', (done) => {
        request(app)
            .get('/csv/Contact')
            .set('Accept', 'application/json')
            .set('token', token)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});

describe('CSV Dump Negative Tests', () => {
    it('Negative Test (422) for CSV Dump on Contact', (done) => {
        request(app)
            .get('/csv/contact')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('Negative Test (422) for CSV Dump on Entity', (done) => {
        request(app)
            .get('/csv/entity')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('Negative Test (422) for CSV Dump on User', (done) => {
        request(app)
            .get('/csv/user')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('Negative Test (422) for CSV Dump on UserRole', (done) => {
        request(app)
            .get('/csv/userRole')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('Negative Test (404) for CSV Dump endpoint', (done) => {
        request(app)
            .get('/csv/')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('Negative Test (503) for CSV Dump endpoint', (done) => {
        request(app)
            .get('/csv/%^&&!@&#)(@*&#()@*&)(*&)(*&(@&#)(!&*#)(*&!@#()*&()*!@&#()*&#&))*&(&()*&#!!@#!@#!@#)(&*)(*&)(*!&#')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(503)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});