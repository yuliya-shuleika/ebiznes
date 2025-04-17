package controllers

import play.api.mvc._
import play.api.libs.json._
import models.CartItem
import repository.CartRepository

import javax.inject._
import scala.concurrent.{ExecutionContext, Future}

@Singleton
class CartController @Inject()(cc: ControllerComponents, repo: CartRepository)(implicit ec: ExecutionContext)
    extends AbstractController(cc) {

    def getCartItems: Action[AnyContent] = Action.async {
        repo.list().map(items => Ok(Json.toJson(items)))
    }

    def addItem: Action[JsValue] = Action(parse.json).async { request =>
        request.body.validate[CartItem].fold(
        errors => Future.successful(BadRequest(JsError.toJson(errors))),
        item => repo.add(item).map(_ => Created(Json.obj("status" -> "added")))
        )
    }

    def removeItem(productId: Long): Action[AnyContent] = Action.async {
        repo.remove(productId).map {
        case true => NoContent
        case false => NotFound(Json.obj("error" -> "Item not found in cart"))
        }
    }

    def clearCart: Action[AnyContent] = Action.async {
        repo.clear().map(_ => NoContent)
    }
}
