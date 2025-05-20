FROM golang:1.24.3-alpine

RUN apk update && apk upgrade && apk add --no-cache gcc musl-dev sqlite sqlite-dev

WORKDIR /app

COPY . .

ENV CGO_ENABLED=1

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]
