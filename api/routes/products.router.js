const express = require('express');

const ProductService = require('./../services/product.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  getProductSchema,
  createProductSchema,
  updateProductSchema
} = require('./../schemas/product.schema');


const router = express.Router();
const productService = new ProductService;

router.get('/', async (req, res) => {
  const products = await productService.find();
  res.json(products);
});

router.get('/filter', (req, res) => {
  res.send('Yo soy un filter');
});

router.get('/:id', validatorHandler(getProductSchema, 'params') ,async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await productService.findOne(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',validatorHandler(createProductSchema, 'body') ,async (req, res) => {
  const body = req.body;
  const newProduct = await productService.create(body);
  res.status(201).json(newProduct);
});

router.patch('/:id',
validatorHandler(getProductSchema, 'params'),
validatorHandler(updateProductSchema, 'body'),
async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const product = await productService.update(id, body);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const producDeleted = await productService.delete(id);
  res.json(producDeleted);
});

module.exports = router;
