# Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- AWS Account (for S3)
- Domain name (for production)

## Local Development

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Setup PostgreSQL:**
```bash
# Create database
createdb ar_heritage

# Run migrations
psql -U postgres -d ar_heritage -f src/database/schema.sql
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your local credentials
```

4. **Start development server:**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## Production Deployment

### Option 1: Docker

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

2. **Build and run:**
```bash
docker build -t ar-heritage-backend .
docker run -p 5000:5000 --env-file .env ar-heritage-backend
```

3. **Docker Compose (with PostgreSQL):**
```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: ar_heritage
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./src/database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"

  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: ar_heritage
      DB_USER: postgres
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_REGION: ${AWS_REGION}
      AWS_S3_BUCKET: ${AWS_S3_BUCKET}
    depends_on:
      - db

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose up -d
```

### Option 2: AWS Elastic Beanstalk

1. **Install EB CLI:**
```bash
pip install awsebcli
```

2. **Initialize:**
```bash
eb init -p node.js-18 ar-heritage-backend
```

3. **Create environment:**
```bash
eb create ar-heritage-prod
```

4. **Set environment variables:**
```bash
eb setenv DB_HOST=your-rds-endpoint \
  DB_NAME=ar_heritage \
  DB_USER=postgres \
  DB_PASSWORD=your-password \
  JWT_SECRET=your-secret \
  AWS_S3_BUCKET=your-bucket
```

5. **Deploy:**
```bash
eb deploy
```

### Option 3: DigitalOcean App Platform

1. **Create `app.yaml`:**
```yaml
name: ar-heritage-backend
services:
  - name: api
    github:
      repo: your-username/ar-heritage-backend
      branch: main
    build_command: npm install
    run_command: node src/server.js
    envs:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: "5000"
      - key: DB_HOST
        value: ${db.HOSTNAME}
      - key: DB_PORT
        value: ${db.PORT}
      - key: DB_NAME
        value: ${db.DATABASE}
      - key: DB_USER
        value: ${db.USERNAME}
      - key: DB_PASSWORD
        value: ${db.PASSWORD}
    http_port: 5000

databases:
  - name: db
    engine: PG
    version: "14"
```

2. **Deploy via CLI:**
```bash
doctl apps create --spec app.yaml
```

### Option 4: Heroku

1. **Create app:**
```bash
heroku create ar-heritage-backend
```

2. **Add PostgreSQL:**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

3. **Set environment variables:**
```bash
heroku config:set JWT_SECRET=your-secret
heroku config:set AWS_ACCESS_KEY_ID=your-key
heroku config:set AWS_SECRET_ACCESS_KEY=your-secret
heroku config:set AWS_REGION=us-east-1
heroku config:set AWS_S3_BUCKET=your-bucket
```

4. **Deploy:**
```bash
git push heroku main
```

5. **Run migrations:**
```bash
heroku pg:psql < src/database/schema.sql
```

## Database Setup

### AWS RDS (PostgreSQL)

1. Create RDS instance in AWS Console
2. Security group: Allow inbound on port 5432
3. Connect and run migrations:
```bash
psql -h your-rds-endpoint.rds.amazonaws.com -U postgres -d ar_heritage -f src/database/schema.sql
```

### DigitalOcean Managed Database

1. Create PostgreSQL cluster
2. Add trusted sources (your app's IP)
3. Connect and run migrations:
```bash
psql "postgresql://user:password@host:port/database?sslmode=require" -f src/database/schema.sql
```

## AWS S3 Setup

1. **Create S3 bucket:**
```bash
aws s3 mb s3://ar-heritage-assets
```

2. **Configure CORS:**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

3. **Set bucket policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ar-heritage-assets/*"
    }
  ]
}
```

4. **Create IAM user with S3 permissions:**
- AmazonS3FullAccess policy
- Save Access Key ID and Secret Access Key

## Environment Variables

### Required
```bash
PORT=5000
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=ar_heritage
DB_USER=postgres
DB_PASSWORD=your-secure-password
JWT_SECRET=your-very-long-random-secret-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=ar-heritage-assets
```

### Optional
```bash
AI_RECOGNITION_API_URL=https://api.example.com/recognize
AI_RECOGNITION_API_KEY=your-api-key
```

## SSL/HTTPS

### Using Let's Encrypt (Nginx)

1. **Install Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx
```

2. **Nginx config:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Get certificate:**
```bash
sudo certbot --nginx -d api.yourdomain.com
```

## Monitoring

### PM2 (Process Manager)

```bash
npm install -g pm2

# Start
pm2 start src/server.js --name ar-heritage

# Monitor
pm2 monit

# Logs
pm2 logs ar-heritage

# Auto-restart on reboot
pm2 startup
pm2 save
```

### Health Checks

```bash
# Add to cron
*/5 * * * * curl -f http://localhost:5000/health || systemctl restart ar-heritage
```

## Performance Optimization

1. **Enable compression:**
```javascript
import compression from 'compression';
app.use(compression());
```

2. **Database connection pooling:**
Already configured in `src/config/database.js`

3. **Caching with Redis:**
```bash
npm install redis
```

```javascript
import redis from 'redis';
const client = redis.createClient();
```

4. **CDN for static assets:**
Use CloudFront with S3 bucket

## Security Checklist

- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Set secure environment variables
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Use helmet.js (already included)
- [ ] Validate all inputs (Joi validation included)
- [ ] Sanitize file uploads
- [ ] Use prepared statements (pg library does this)
- [ ] Regular security updates: `npm audit fix`
- [ ] Backup database regularly
- [ ] Monitor logs for suspicious activity

## Backup Strategy

### Database Backups

```bash
# Daily backup script
pg_dump -h your-db-host -U postgres ar_heritage > backup-$(date +%Y%m%d).sql

# Restore
psql -h your-db-host -U postgres ar_heritage < backup-20240101.sql
```

### S3 Versioning

Enable versioning on S3 bucket for automatic file backups.

## Scaling

### Horizontal Scaling

1. Use load balancer (AWS ALB, Nginx)
2. Run multiple instances
3. Share session state (Redis)
4. Use managed database with read replicas

### Vertical Scaling

1. Increase server resources
2. Optimize database queries
3. Add database indexes (already included in schema)
4. Use caching layer

## Troubleshooting

### Database connection issues
```bash
# Test connection
psql -h your-db-host -U postgres -d ar_heritage

# Check logs
tail -f /var/log/postgresql/postgresql.log
```

### S3 upload failures
- Verify IAM permissions
- Check bucket CORS configuration
- Validate AWS credentials

### High memory usage
```bash
# Monitor
pm2 monit

# Restart
pm2 restart ar-heritage
```
