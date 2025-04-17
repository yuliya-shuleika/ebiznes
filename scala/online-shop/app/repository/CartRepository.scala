package repository

import models.CartItem
import scala.collection.mutable
import scala.concurrent.{ExecutionContext, Future}
import javax.inject._

class CartRepository @Inject(productRepo: ProductRepository)(implicit ec: ExecutionContext) {
    private val cart = mutable.ListBuffer.empty[CartItem]

    def list(): Future[Seq[CartItem]] = Future.successful(cart.toList)

    def add(item: CartItem): Future[Unit] = Future {
        if (!productRepo.productExists(item.productId)) {
            throw new IllegalArgumentException("Product does not exist")
        }

        val idx = cart.indexWhere(_.productId == item.productId)
        if (idx >= 0) {
        val existing = cart(idx)
            cart.update(idx, existing.copy(quantity = existing.quantity + item.quantity))
        } else {
            cart += item
        }
    }

    def remove(productId: Long): Future[Boolean] = Future {
        if (!productRepo.productExists(productId)) {
            throw new IllegalArgumentException("Product does not exist")
        }

        val idx = cart.indexWhere(_.productId == productId)
        if (idx == -1) {
            false
        } else {
            cart.remove(idx)
            true
        }
    }

    def clear(): Future[Unit] = Future.successful(cart.clear())
}
