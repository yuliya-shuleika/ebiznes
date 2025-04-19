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
import kotlinx.serialization.Serializable

@Serializable
data class Product(
    val name: String,
    val category: String,
    val price: Double
)

val categories = listOf("Clothes", "Shoes", "Cosmetics")

val products = listOf(
    Product("Skirt", "Clothes", 29.99),
    Product("T-shirt", "Clothes", 39.99),
    Product("Dress", "Clothes", 49.99),
    Product("Snickers", "Shoes", 49.99),
    Product( "Boots", "Shoes", 69.99),
    Product("Lipstick", "Cosmetics", 14.99),
    Product( "Blush", "Cosmetics", 19.99),
    Product("Mascara", "Cosmetics", 24.99)
)

val productsByCategories = mapOf(
    "Clothes" to listOf("Skirt", "T-shirt", "Dress"),
    "Shoes" to listOf("Snickers", "Boots"),
    "Cosmetics" to listOf("Lipstick", "Blush", "Mascara")
)

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
        } else if(content.startsWith("/products")) {
            val parts = content.split("/")
            if(parts.size <= 2) {
                sendMessage(channelId, formatProducts(products), botToken)
            } else {
                val category = parts.getOrNull(2)?.capitalize()
                val items = productsByCategories[category]
                val productsByCat = products.filter { items?.contains(it.name) == true }
                sendMessage(channelId, formatProducts(productsByCat), botToken)
            }
        }
    }

    kord.login {
        intents += Intent.MessageContent
    }
}

fun formatProducts(products: List<Product>): String {
    return products.joinToString("\n\n") { product ->
        """
        Product: ${product.name}
        Category: ${product.category}
        Price: ${"%.2f".format(product.price)} PLN
        """.trimIndent()
    }
}


