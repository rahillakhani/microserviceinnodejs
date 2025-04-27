```markdown
# Review Ingestion Microservice

## Running
```bash
docker-compose up --build
```

### Manual run
```bash
docker-compose exec api npm run start
```

### Database Schema
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