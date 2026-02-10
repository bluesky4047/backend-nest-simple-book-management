import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from '../src/auth/auth.entity';
import bcrypt from 'bcrypt';

describe('Category API (JWT E2E)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 🔹 Seed user test jika belum ada
    const authRepo = moduleFixture.get(getRepositoryToken(Auth));
    const existing = await authRepo.findOne({
      where: { email: 'test2@gmail.com' },
    });

    if (!existing) {
      const hashedPassword = await bcrypt.hash('1234', 10); // plaintext password = 1234
      await authRepo.save({
        email: 'test2@gmail.com',
        password: hashedPassword,
      });
    }

    // 🔹 Login pakai plaintext password
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test2@gmail.com',
        password: '1234',
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
    expect(res.body.data.length).toBeGreaterThan(0);

    // General check: id number, category string
    res.body.data.forEach((cat: any) => {
      expect(typeof cat.id).toBe('number');
      expect(typeof cat.category).toBe('string');
    });
  });
});
