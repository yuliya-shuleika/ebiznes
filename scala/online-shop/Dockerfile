FROM sbtscala/scala-sbt:eclipse-temurin-jammy-21_35_1.9.6_3.3.1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y curl  && \
    curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
    | tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
    && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
    | tee /etc/apt/sources.list.d/ngrok.list \
    && apt update \
    && apt install ngrok

COPY . .

EXPOSE 9000

RUN chmod +x entrypoint.sh

CMD ["/app/entrypoint.sh"]
