<h3>To build first time</h3> 
docker-compose up --build

<h3>To retry docker build</h3>
docker-compose down && docker-compose up --build

<h3>To connect to docker and test data in DB</h3>
docker-compose exec db psql -U postgres -d reviews

<i>** refer to ReadMe.md for db commands.</i>

