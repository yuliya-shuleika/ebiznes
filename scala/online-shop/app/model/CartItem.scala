package models

case class CartItem(productId: Long, quantity: Int)

import play.api.libs.json._
object CartItem {
    implicit val format: OFormat[CartItem] = Json.format[CartItem]
}
