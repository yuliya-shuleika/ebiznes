package repository

import models.{Category, CategoryInput}
import scala.collection.mutable
import scala.concurrent.{ExecutionContext, Future}
import javax.inject._

class CategoryRepository @Inject()(implicit ec: ExecutionContext) {
    private val categories = mutable.ListBuffer(
        Category(1, "Clothes"),
        Category(2, "Shoes")
    )

    private def nextId = if (categories.isEmpty) 1 else categories.map(_.id).max + 1

    def list(): Future[Seq[Category]] = Future.successful(categories.toList)

    def findById(id: Long): Future[Option[Category]] = Future.successful(categories.find(_.id == id))

    def create(category: CategoryInput): Future[Category] = Future {
        val categoryWithId = Category(nextId, category.name)
        categories += categoryWithId
        categoryWithId
    }

    def update(id: Long, updated: CategoryInput): Future[Option[Category]] = Future {
        if (!categories.exists(_.id == id)) {
            None
        } else {
            val idx = categories.indexWhere(_.id == id)
            val newCategory = Category(id, updated.name)
            categories.update(idx, newCategory)
            Some(newCategory)
        }
    }

    def delete(id: Long): Future[Boolean] = Future {
        if (!categories.exists(_.id == id)) {
            false
        } else { 
            val idx = categories.indexWhere(_.id == id)
            categories.remove(idx)
            true
        }
    }
}
