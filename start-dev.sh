########################################################

## Shell Script to Build Docker Image and Deploy Local Docker Compose  

########################################################
pwd

if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

echo 'docker compose starting'
# docker-compose build --force-rm --no-cache
docker-compose -f ./docker-compose.dev.yml up --build -d 

echo 'running migrations'

docker exec node_dev npx sequelize db:migrate

docker-compose -f ./docker-compose.dev.yml up