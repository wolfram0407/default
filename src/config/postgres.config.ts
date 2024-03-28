import {registerAs} from '@nestjs/config';

export default registerAs('postgres', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5434,
  database: process.env.DB_USERNAME || 'devcamp',
  username: process.env.DB_PASSWORD || 'devcamp',
  password: process.env.DB_DATABASE || 'test',
}));