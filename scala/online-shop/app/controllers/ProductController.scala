package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.{Product, ProductInput}
import repository.ProductRepository

import scala.collection.mutable
import scala.concurrent.{ExecutionContext, Future}


@Singleton
class ProductController @Inject()(cc: ControllerComponents, repo: ProductRepository)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  def listProducts = Action.async {
    repo.list().map(products => Ok(Json.toJson(products)))
  }

  def getProduct(id: Int) = Action.async {
    repo.findById(id).map {
      case Some(product) => Ok(Json.toJson(product))
      case None => NotFound(Json.obj("error" -> "Product not found"))
    }
  }

  def addNewProduct: Action[JsValue] = Action(parse.json).async { request =>
    request.body.validate[ProductInput].fold(
      errors => Future.successful(BadRequest(JsError.toJson(errors))),
      product => {
        repo.create(product).map { createdProduct =>
          Created(Json.toJson(createdProduct))
        }
      }
    )
  }

  def updateProduct(id: Int): Action[JsValue] = Action(parse.json).async { request =>
    request.body.validate[ProductInput].fold(
      errors => Future.successful(BadRequest(JsError.toJson(errors))),
      product => {
        repo.update(id, product).map {
          case Some(updatedProduct) => Ok(Json.toJson(updatedProduct))
          case None => NotFound(Json.obj("error" -> "Product not found"))
        }
      }
    )
  }

  def deleteProduct(id: Int) = Action.async {
    repo.delete(id).map {
      case true => NoContent
      case false => NotFound(Json.obj("error" -> "Product not found"))
    }
  }
}
