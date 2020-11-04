// Memanggil express
const express = require('express')

// Memanggil Router di express
const router = express.Router()

// Memanggil body di express-validator
// Body ini untuk memberi aturan pada req.body yang dikirmkan oleh user
const {body} = require('express-validator')

// Memanggil controller yang dibutuhkan
const blogController = require('../controllers/Blog')

// Membuat router post untuk create blog dengan url '/post'
// url ini akan digabung dengan url yang di index menjadi 'localhost:4000/v1/blog/post
router.post('/post', [
    // Memberi aturan kepada req.body.title, req.body.subTitle dan req.body.body
    body('title').isLength({min : 5}).withMessage('Input title minimum 5 character'),
    body('subTitle').isLength({min : 5}).withMessage('Input sub-title minimum 5 character'),
    body('body').isLength({min : 5}).withMessage('Input body minimum 5 character')
    // Aturannya bisa di-custom seperti di dokumentasi dari express-validator nya
    // isLength => Untuk membatasi jumlah huruf maksimal maupun minimal
    // withMessage => Untuk memberi pesan error yang akan diteruskan ke controller nya
    ], 
    // Memanggil controller
    blogController.createBlog)

// Membuat router posts untuk mengambil semua data dengan url '/posts'
// url ini akan digabung dengan url yang di index menjadi 'localhost:4000/v1/blog/posts
router.get('/posts', blogController.getAllPost)
// Membuat router untuk mengambil data berdasarkan id dengan url '/post/idnya'
// url ini akan digabung  dengan url yang di index menjadi 'localhost:4000/v1/blog/post'
// url ini berbeda dengan url '/post' di atas yang menambahkan data di atas menngunakan request post
// url ini akan menggunakan get karena hanya mengambil data
router.get('/post/:postId', blogController.getBlogPost)

// Membuat router untuk meng-update data berdasarkan id dengan url '/post/idnya'
// Akan menggunakan request method put untuk mnegupdate data
// url ini akan digabung  dengan url yang di index menjadi 'localhost:4000/v1/blog/post'
router.put('/post/:postId', [
    // Memberi aturan kepada req.body.title, req.body.subTitle dan req.body.body
    body('title').isLength({min : 5}).withMessage('Input title minimum 5 character'),
    body('subTitle').isLength({min : 5}).withMessage('Input sub-title minimum 5 character'),
    body('body').isLength({min : 5}).withMessage('Input body minimum 5 character')
    // Aturannya bisa di-custom seperti di dokumentasi dari express-validator nya
    // isLength => Untuk membatasi jumlah huruf maksimal maupun minimal
    // withMessage => Untuk memberi pesan error yang akan diteruskan ke controller nya
    ], 
    // Memanggil controller
    blogController.updateBlog)

// Membuat router untuk menghapus data blog berdasarkan id dengan url 'localhost:4000/v1/blog/post/idnya'
// Akan menggunakan request method delete untuk menghapus data
router.delete('/post/:postId', blogController.deleteBlog);

// Mengeksports module router agar bisa digunakan di index
module.exports = router;