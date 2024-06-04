const {Router}= require('express');
const controller = require('./controller');
const router = Router();

// GET Book
router.get('/get/book', controller.getBook);
router.get('/get/book/:id', controller.getBookbyID);

// GET Customer
router.get('/get/customer', controller.getCustomer);
router.get('/get/customer/:id', controller.getCustomerbyID);

// POST Book
router.post('/add/book', controller.addBook);

//POST Customer
router.post('/add/customer', controller.addCustomer);

// DELETE Book
router.delete('/delete/book/:id', controller.removeBook);

// DELETE Customer
router.delete('/delete/customer/:id', controller.removeCustomer);

// UPDATE Book
router.put('/update/book/:id', controller.updateBook);

// UPDATE Customer
router.put('/update/customer/:id', controller.updateCustomer);

// SQL Builder
router.post('/book/filter', controller.dynamicSQL);

// TCL
router.post('/post/tclPost', controller.tclPost);
router.delete('/delete/tclDelete/:id', controller.tclDelete);

module.exports = router;
