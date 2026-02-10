import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from '../src/auth/auth.entity';
import * as bcrypt from 'bcrypt';

describe('Category API (JWT E2E)', () => {
  let app: INestApplication;
  let token: string;

  // user khusus E2E
  const TEST_USER = {
    email: 'e2e-category-test@local.test',
    password: '1234',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const authRepo = moduleFixture.get(getRepositoryToken(Auth));

    // Pastikan user test SELALU clean
    await authRepo.delete({ email: TEST_USER.email });

    // Create user test
    const hashedPassword = await bcrypt.hash(TEST_USER.password, 10);
    await authRepo.save({
      email: TEST_USER.email,
      password: hashedPassword,
    });

    // Login untuk ambil JWT
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: TEST_USER.email,
        password: TEST_USER.password,
      })
      .expect(201);

    token = loginResponse.body.token;
    expect(token).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /category tanpa token harus 401', async () => {
    await request(app.getHttpServer()).get('/category').expect(401);
  });

  it('GET /category dengan token harus 200 dan data valid', async () => {
    const res = await request(app.getHttpServer())
      .get('/category')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Categories retrieved successfully');
    expect(Array.isArray(res.body.data)).toBe(true);

    // optional: kalau category memang wajib ada
    if (res.body.data.length > 0) {
      res.body.data.forEach((cat: any) => {
        expect(typeof cat.id).toBe('number');
        expect(typeof cat.category).toBe('string');
      });
    }
  });
});
