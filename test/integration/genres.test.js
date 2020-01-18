let server;
const request = require('supertest');
const { Genre } = require('../../schema/genre');
const { User } = require('../../schema/user');

describe('/api/genres', () => {

    beforeEach(() => { server = require('../../index'); })

    afterEach(async () => {
        server.close();
        await Genre.remove();
    })

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ])
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name == 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name == 'genre2')).toBeTruthy();
        })
    })

    describe('GET /:id', () => {
        it('should return genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        })

        it('should return false if invalid id', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        })
    })

    describe('POST /', () => {

        let token;
        let name;

        beforeEach(() => {
            token = new User().generateAuthToken(),
                name = 'genre1'
        });

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: name });
        }
        it('status 401 if user is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(404);
        })

        it('status 400 if user sends short genre name', async () => {
            name = '1234'
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('status 400 if user sends long genre name', async () => {
            name = new Array(52).join('ab');
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should save genre if no error', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).not.toBeNull();
        })

        it('should return genre if saved', async () => {

            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'genre1');
        })
    })
})