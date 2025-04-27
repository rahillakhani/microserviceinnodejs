
# Review System Microservice
### microserviceinnodejs

## Setup
```bash
docker-compose up --build
```

### Run manually
```bash
docker-compose exec app npm run start
```

### Schema:
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  hotel_id INT NOT NULL,
  platform VARCHAR(255) NOT NULL,
  hotel_name TEXT,
  comment JSONB,
  overall_by_providers JSONB
);

CREATE TABLE processed_files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) UNIQUE
);
```