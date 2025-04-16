package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._

import scala.collection.mutable
import scala.concurrent.{ExecutionContext, Future}

case class Product(id: Int, name: String, price: Double)

object Product {
  implicit val format: OFormat[Product] = Json.format[Product]
}

@Singleton
class ProductController @Inject()(cc: ControllerComponents)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  private val products = mutable.ListBuffer(
    Product(1, "Laptop", 1200.0),
    Product(2, "Phone", 700.0)
  )

  def listProducts = Action {
    Ok(Json.toJson(products))
  }

  def getProduct(id: Int) = Action {
    if (products.exists(_.id == id)) {
      Ok(Json.toJson(products.find(_.id == id)))
    } else {
      NotFound(Json.obj("error" -> "Product not found"))

    }
  }

  def addNewProduct: Action[JsValue] = Action(parse.json).async { request =>
    request.body.validate[Product].fold(
      errors => Future.successful(BadRequest(JsError.toJson(errors))),
      product => {
        if (products.exists(_.id == product.id)) {
          Future.successful(BadRequest(Json.obj("error" -> "Product with this ID already exists")))
        } else {
          products += product
          Future.successful(Created(Json.toJson(product)))
        }
      }
    )
  }

  def updateProduct(id: Int): Action[JsValue] = Action(parse.json).async { request =>
    request.body.validate[Product].fold(
      errors => Future.successful(BadRequest(JsError.toJson(errors))),
      product => {
        if(products.exists(_.id == id)) {
          products(products.indexWhere(_.id == id)) = product
          Future.successful(Ok(Json.toJson(product)))
        } else {
          Future.successful(NotFound(Json.obj("error" -> "Product not found")))
        }
      }
    )
  }

  def deleteProduct(id: Int) = Action {
    if (products.exists(_.id == id)) {
      products -= products.find(_.id == id).get
      Ok(Json.obj("status" -> "Product deleted"))
    } else {
      NotFound(Json.obj("error" -> "Product not found"))
    }
  }
}
