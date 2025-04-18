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

val categories = listOf("Clothes", "Shoes", "Books", "Accessories", "Cosmetics")

fun main() = runBlocking {
    val channelId = "1335376065878560788"
    val botToken = ""

    sendMessage(channelId, "Hi from Ktor!", botToken)
    startBot(channelId, botToken)
}

suspend fun sendMessage(channelId: String, message: String, botToken: String) {
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
suspend fun startBot(channelId: String, botToken: String) {
    val kord = Kord(botToken)

    kord.on<MessageCreateEvent> {
        val content = message.content
        if (content.startsWith("/categories")) {
            val response = categories.joinToString("\n")
            sendMessage(channelId, response, botToken)
        }
    }

    kord.login {
        intents += Intent.MessageContent
    }
}
