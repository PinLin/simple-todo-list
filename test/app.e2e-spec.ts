import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as crypto from 'crypto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const username = 'just_for_e2e_test';
  const password = crypto.randomUUID();
  let jwt: string;
  let todoId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should say "Hello World"', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should create a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/user')
      .send({ username, password })
      .expect(201);
    expect(JSON.stringify(res.body)).toBe(JSON.stringify({ username }));

    return res;
  });

  it('should login successfully', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth')
      .send({ username, password })
      .expect(201);
    expect(res.body.accessToken).toBeDefined();

    jwt = res.body.accessToken;

    return res;
  });

  it('should return a user object', async () => {
    const res = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200);
    expect(JSON.stringify(res.body)).toBe(JSON.stringify({ username }));

    return res;
  });

  it('should change the password of the specific user', async () => {
    const res = await request(app.getHttpServer())
      .put('/user/password')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ oldPassword: password, newPassword: password })
      .expect(204);

    return res;
  });

  it('should change the password of the specific user', async () => {
    const res = await request(app.getHttpServer())
      .put('/user/password')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ oldPassword: password, newPassword: password })
      .expect(204);

    return res;
  });

  it('should create a todo for the user', async () => {
    const res = await request(app.getHttpServer())
      .post('/todo')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ title: 'test', description: 'test' })
      .expect(201);
    expect(res.body.title).toBe('test');
    expect(res.body.description).toBe('test');

    todoId = res.body.id;

    return res;
  });

  it('should show all todos of a specific user', async () => {
    const res = await request(app.getHttpServer())
      .get('/todo')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200);
    expect(res.body).toHaveLength(1);

    return res;
  });

  it('should update the specific todo', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/todo/${todoId}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({ title: 'wow', description: 'wow', completed: true })
      .expect(200);
    expect(res.body.title).toBe('wow');
    expect(res.body.description).toBe('wow');
    expect(res.body.completed).toBeTruthy();

    return res;
  });

  it('should delete the specific todo', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/todo/${todoId}`)
      .set('Authorization', `Bearer ${jwt}`)
      .expect(204);

    return res;
  });

  it('should delete the specific user', async () => {
    const res = await request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(204);

    return res;
  });

  afterAll(async () => {
    await app.close();
  });
});
