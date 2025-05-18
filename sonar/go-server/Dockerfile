FROM golang:1.21

RUN apt-get update && apt-get install -y \
    gcc \
    sqlite3 \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

ENV CGO_ENABLED=1

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]


