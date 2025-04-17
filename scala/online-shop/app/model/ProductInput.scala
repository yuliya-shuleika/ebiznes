package models
import play.api.libs.json._

case class ProductInput(name: String, price: Double, categoryId: Int)

object ProductInput {
    implicit val format: OFormat[ProductInput] = Json.format[ProductInput]
}