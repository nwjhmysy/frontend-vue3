build-dev-image:
	docker build --platform=linux/amd64 -t yinsiyu/frontend-vue3 .

docker-run:
	docker-compose up -d

docker-down:
	docker-compose down

docker-push:
	docker push yinsiyu/frontend-vue3:latest
