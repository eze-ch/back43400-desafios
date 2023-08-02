import { Router } from "express";
import { CartsManager } from '../cartsManager.js';

const router = Router();

const cartsManager = new CartsManager('./carts.json', './products.json');

router.get('/', async (req, res) => {
    try {
        const carts = await cartsManager.getCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await cartsManager.getCartById(id);
        res.json(cart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = await cartsManager.addCart();
        res.send(newCart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartsManager.addProductToCart(cid, pid);
        res.send(cart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


export default router;