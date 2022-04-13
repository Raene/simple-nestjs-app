########################################################

## Shell Script to Build Docker Image and Deploy Local Docker Compose  

########################################################
pwd

# load env variables from .env
if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

docker-compose rm -f

echo 'docker compose starting'
docker-compose up -d


docker exec node npx sequelize db:migrate