const express = require('express');
const { getAllProduct, getAdminProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteProductReviews, uploadProductImage, removeProductImage } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleWare/auth');
const multer = require('multer');
const fileUpload = require('express-fileupload');
const app = express();
const bodyParser = require('body-parser');

app.use(fileUpload());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// var type = upload.single('file');

const router = express.Router();

//API to get all product
router.get("/products", getAllProduct);

// API to find Admin Product
router.get("/admin/products", isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);


//API to create product
// router.route("/prouduct/new").post(createProduct);
router.post("/admin/product/new", isAuthenticatedUser, authorizeRoles("admin"), createProduct);

//API to put update product
router.put("/admin/product/:id", isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

// router.put("/product/:id", updateProduct).delete(deleteProduct).get(getProductDetails);

//API to delete product
router.delete("/admin/product/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// API to get single product details
router.get("/product/:id", getProductDetails);

// API for review and rating
router.put("/review", isAuthenticatedUser, createProductReview);

// API to get all Product Reviews
router.get("/reviews", getProductReviews);

// API to delete Product Reviews
router.delete("/reviews", isAuthenticatedUser, deleteProductReviews);

// API for upload Image
// router.post("/admin/product/upload" , upload.single('file'), isAuthenticatedUser ,authorizeRoles("admin"), uploadProductImage);
router.post("/admin/product/uploadImage", isAuthenticatedUser, authorizeRoles("admin"), uploadProductImage);

// // API for delete Image
// router.delete("/admin/product/removeImage", isAuthenticatedUser ,authorizeRoles("admin"), removeProductImage);

module.exports = router;


