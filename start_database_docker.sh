# Start PostgreSQL container
docker run --name luxeverse-postgres \
  -e POSTGRES_DB=luxeverse_db \
  -e POSTGRES_USER=luxeverse_user \
  -e POSTGRES_PASSWORD=StrongPass123 \
  -p 5432:5432 \
  -d postgres:16

# Wait for container to start, then run migrations
pnpm db:push
pnpm db:seed

