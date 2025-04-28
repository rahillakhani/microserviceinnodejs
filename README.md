# Review Ingestion Microservice

A lightweight Node.js service that fetches hotel review data from AWS S3 `.jl` files and neatly stores it into a PostgreSQL database. Built for resilience, concurrency, and quick deployment — just plug it in and watch the magic happen.

---

## What's This About?
This microservice will:
- Hunt down `.jl` review files from your S3 bucket
- Parse and validate each juicy review
- Save clean review data into Postgres
- Auto-create the database tables if they're missing
- All inside a tidy, containerized Docker setup

---

## How to Build and Get Running

### You’ll Need:
- Docker + Docker Compose installed
- An AWS S3 bucket ready with `.jl` files
- An IAM User with `AmazonS3ReadOnlyAccess`

### Quick Setup

1. Clone this repo:
   ```bash
   git clone your-repo-url
   cd project-folder
   ```

2. Set up your environment variables (`.env` file or inside `docker-compose.yml`):
```env
AWS_ACCESS_KEY_ID={accessid}
AWS_SECRET_ACCESS_KEY={accesskey}
AWS_REGION=ap-south-1
S3_BUCKET_NAME=microserviceinnodejs
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=reviews
```

3. Build and run everything:
```bash
docker-compose up --build
```
<i>refer testData/steps.md for testing commands</i>

 
This will:
- Spin up Postgres
- Build and start the microservice
- Create the tables if they don’t exist yet

You’re now ready to ingest reviews

---

## 🧪 Testing It Out

### 1. Upload Some Sample Data
- Head to your AWS S3 console.
- Upload your `.jl` files like `sample_reviews_1.jl` into your bucket (no folders, just the root).

<i>refer testData folder for upload files</i>

### 2. Watch the Logs
- Keep an eye on the terminal logs:
```bash
[INFO] Successfully processed: sample_reviews_1.jl
```

### 3. Peek Inside the Database

Pop into the Postgres container:
```bash
docker-compose exec db psql -U postgres -d reviews
```
<i>refer testData/steps.md for testing commands</i>

Run these queries to admire your handiwork:
```sql
SELECT * FROM reviews;
SELECT * FROM processed_files;
```

Your freshly ingested reviews should be visible in there!

---

## Highlights and Design Choices

| Feature          | Why We Chose It |
|------------------|-----------------|
| AWS SDK          | Modular `@aws-sdk/client-s3` v3 for lightweight calls |
| DB Client        | Native `pg` Node.js client |
| Retry Logic      | Built-in exponential backoff to stay resilient |
| Parallelism      | Controlled concurrency for stability |
| Code Style       | Modular, clean TypeScript |
| Database Prep    | Tables auto-created if missing |

---

## 🧙‍♂️ Built With
Built by "Rahil Lakhani" 
