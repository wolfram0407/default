import {registerAs} from '@nestjs/config';

export default registerAs('postgres', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || Number(0),
  database: process.env.DB_USERNAME || '',
  username: process.env.DB_PASSWORD || '',
  password: process.env.DB_DATABASE || '',
}));