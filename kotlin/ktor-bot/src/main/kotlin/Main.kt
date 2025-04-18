package org.example
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import kotlinx.coroutines.runBlocking
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent

fun main() = runBlocking {
    val channelId = "1335376065878560788"
    val botToken = ""

    sendHelloMessage(channelId, "Hi from Ktor!", botToken)
    startBot(botToken)
}

suspend fun sendHelloMessage(channelId: String, message: String, botToken: String) {
    val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json()
        }
    }

    val url = "https://discord.com/api/v10/channels/$channelId/messages"

    client.post(url) {
        headers {
            append("Authorization", "Bot $botToken")
            append("Content-Type", "application/json")
        }
        setBody(
            buildJsonObject {
                put("content", message)
            }
        )
    }

    client.close()
}

@OptIn(PrivilegedIntent::class)
suspend fun startBot(botToken: String) {
    val kord = Kord(botToken)

    kord.on<MessageCreateEvent> {
        val content = message.content
        println("message text: $content")
    }

    kord.login {
        intents += Intent.MessageContent
    }
}
