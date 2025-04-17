package repository

import models.{Product, ProductInput}
import scala.collection.mutable
import scala.concurrent.{ExecutionContext, Future}
import javax.inject._

class ProductRepository @Inject()(implicit ec: ExecutionContext) {
    private val products = mutable.ListBuffer(
        Product(1, "Floral dress", 2123.0, 1),
        Product(2, "Snickers", 233.0, 2)
    )

    private def nextId = if (products.isEmpty) 1 else products.map(_.id).max + 1

    def list(): Future[Seq[Product]] = Future.successful(products.toList)

    def findById(id: Long): Future[Option[Product]] = Future.successful(products.find(_.id == id))

    def create(product: ProductInput): Future[Product] = Future {
        val productWithId = Product(nextId, product.name, product.price, product.categoryId)
        products += productWithId
        productWithId
    }

    def update(id: Long, updated: ProductInput): Future[Option[Product]] = Future {
        if (!products.exists(_.id == id)) {
            None
        } else {
            val idx = products.indexWhere(_.id == id)
            val newProduct = Product(id, updated.name, updated.price, updated.categoryId)
            products.update(idx, newProduct)
            Some(newProduct)
        }
    }

    def delete(id: Long): Future[Boolean] = Future {
        if (!products.exists(_.id == id)) {
            false
        } else {
            val idx = products.indexWhere(_.id == id)
            products.remove(idx)
            true
        }
    }

    def productExists(id: Long) : Boolean = {
        products.exists(_.id == id)
    }
}
