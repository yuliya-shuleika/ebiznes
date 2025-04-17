package models
import play.api.libs.json._

case class CategoryInput(name: String)

object CategoryInput {
    implicit val format: OFormat[CategoryInput] = Json.format[CategoryInput]
}