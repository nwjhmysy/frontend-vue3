build-dev-image:
	docker build --platform=linux/amd64 -t yinsiyu/frontend .

docker-run:
	docker-compose up -d

docker-down:
	docker-compose down

docker-push:
	docker pull yinsiyu/frontend:latest
