package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.{Category, CategoryInput}
import repository.CategoryRepository

import scala.collection.mutable
import scala.concurrent.{ExecutionContext, Future}

@Singleton
class CategoryController @Inject()(cc: ControllerComponents, repo: CategoryRepository)(implicit ec: ExecutionContext)
    extends AbstractController(cc) {

    def listCategories: Action[AnyContent] = Action.async {
        repo.list().map(cats => Ok(Json.toJson(cats)))
    }

    def getCategory(id: Long): Action[AnyContent] = Action.async {
        repo.findById(id).map {
        case Some(cat) => Ok(Json.toJson(cat))
        case None => NotFound(Json.obj("error" -> "Category not found"))
        }
    }

    def createCategory: Action[JsValue] = Action(parse.json).async { request =>
        request.body.validate[CategoryInput].fold(
        errors => Future.successful(BadRequest(JsError.toJson(errors))),
        cat => repo.create(cat).map(c => Created(Json.toJson(c)))
        )
    }

    def updateCategory(id: Long): Action[JsValue] = Action(parse.json).async { request =>
        request.body.validate[CategoryInput].fold(
        errors => Future.successful(BadRequest(JsError.toJson(errors))),
        cat => repo.update(id, cat).map {
            case Some(updated) => Ok(Json.toJson(updated))
            case None => NotFound(Json.obj("error" -> "Category not found"))
        }
        )
    }

    def deleteCategory(id: Long): Action[AnyContent] = Action.async {
        repo.delete(id).map {
            case true => NoContent
            case false => NotFound(Json.obj("error" -> "Category not found"))
        }
    }
}
