// Memanggil validationResult dari express-validator yang berisi semua data error dari aturan yang sudah ditetapkan dari routes 
const { validationResult } = require('express-validator');
// Memanggil model untuk keperluan data
const BlogPost = require('../models/Blog');
const path = require('path')
const fs = require('fs');
 
// Membuat function untuk hapus image jika file image di ganti dengan yang baru maka yang lama akan dihapus atau jika data hapus maka image juka akan terhapus
const removeImage = (filePath) => {
    filePath = path.join(__dirname, "../..", filePath);
    fs.unlink(filePath, (error) => console.log("error : ",error));
}
// Mengeksport controller createBlog agar bisa digunakan di routes
exports.createBlog = (req, res, next) => {
    // Membuat vaariabel errors yang berasal dari req validationResult
    const errors = validationResult(req);
    // .isEmpty() => berarti kosong dan '!' => berarti tidak
    // Ini jika variabel errors tidak kosong/ada error-nya maka akan menjalankan code dibawah-nya
    if(!errors.isEmpty()){
        // Membuat Error yang 'Invalid Value' adalah error.message yang akan dikirim ke index sebagai value global jika error
        const err = new Error('Invalid Value');
        // Membuat status error yang akan dikirim ke index
        err.errorStatus = 400;
        // Membuat data yang berisi array variabel errors
        err.data = errors.array();
        // Melemparkan err-nya
        throw err; 
    }

    // Mengecek apakah ada file gambar yang di upload oleh user
    if(!req.file){
        // Membuat Error yang 'Image harus di upload' adalah error.message yang akan dikirim ke index sebagai value global jika error
        const err = new Error('Image harus di upload');
        // Membuat status error yang akan dikirim ke index
        err.errorStatus = 422;
        // Melemparkan err-nya
        throw err; 
    }

    // Memanggil title, subTitle, dan body dari req.body yang dikirimkan oleh client
    const {title, subTitle, body} = req.body;
    const image = req.file.path;
    const author = {
        uid: 1,
        name: 'Raihan Adi Nugroho'
    } 

    // Membuat data dari Model BlogPost
    const Posting = new BlogPost({
        // Dibawah adalah value-value dari req.body
        title,
        subTitle,
        image,
        body,
        author,
    })
    // Akan menyimpan data ke database mongodb
    Posting.save()
    // Jika berhasil maka akan memberikan status 201 message dan data
    .then( result => {
        res.status(201).json({
            message: "created blog",
            // result ini akan berisi data yang dikirimkan oleh user ke database
            data: result
        })
    } )
    // Jika error maka akan menampilkan error ke console
    .catch( err => console.log(err))
}
// Mengeksport controller getAllPost agar bisa digunakan di routes
exports.getAllPost = (req, res, next) => {
    // misal kita akses localhost:4000/posts?page=1&perPage=5
    // Maka '?page=1&perPage=5' disebut juga query
    // Maka query page bernilai 1 dan perPage bernilai 5
    // Nantinya query ini akan berguna sebagai pagination
    const currentPage = req.query.page || 1;
    // Query page ini akan menentukan halaman
    const perPage = req.query.perPage || 5;
    // Query perPage ini akan menentukan jumlah data yang akan diambil per-page
    let totalData;
    // Membuat variabel totalData yang nantinya akan diisi jumlah semua data yang ada di database

    
    BlogPost.find() // Ini akan mengambil semua data yang ada di database
    .countDocuments() // Ini akan menghitu jumlah semua data di database
    .then(count => { // Jika berhasil mendapatkan semua data di database
        totalData = count; // variabel totalData akan diisi count jumlah semua data
        return BlogPost.find() // Me-return 'Mengambil semua data di database'
        .skip((parseInt(currentPage) - 1) * parseInt(perPage)) // Menghitung dari mana data diambil dengan method skip()
        .limit(parseInt(perPage)) // Membatasi data yang akan diambil sesuai query perPage
    })
    .then(result => // Karena then sebelumnya mereturn maka hasil return sebelum ditangkap dengan then lagi
        res.status(200).json({ // Memberikan respone status 200 dan mengberikan data berupa json
            message: "Data Blog Post berhasil dipanggil",
            data: result,
            total_data : totalData,
            current_page: currentPage,
            per_page: perPage
        }))
    .catch( error => next(error)) // Ini jika error maka akan meneruskan error nya ke index
}
// Mengeksport contr  ller getBlogPost agar bisa digunakan di routes
exports.getBlogPost = (req, res, next) => {
    // Mengambil parameter id yang akan digunakan untuk mencari data
    const postId = req.params.postId
    // Mencari data berdasarkan id
    BlogPost.findById(postId)
    .then( result => {
        // Mengecek apakah id ada di API kita jika tidak ada maka akan menampilkan error
        if (!result) {
            const err = new Error('Data tidak ditemukan');
            err.status = 404;
            throw err;
        }
        // Jika berhasil maka akan memberikan response dan data-datanya
        res.status(200).json({
            message: "Data blog post berhasil dipanggil",
            data: result
        })
    })
    .catch(err => next(err))
}
// Mengeksport controller updateBlog agar bisa digunakan di routes
exports.updateBlog = (req, res, next) => { // Banyak kemiripan dengan method create
    const errors = validationResult(res);
    if(!errors.isEmpty()) {
        const err = new Error ("Update gagal");
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    if(!req.file){
        const err = new Error ("Image harus di upload");
        err.status = 422;
        throw err;
    }
    
    const { title, subTitle, body } = req.body;
    const image = req.file.path;
    const author = {
        uid : 1,
        nama: "Raihan Adi Nugroho",
    }

    // Jika mengakses localhost:4000/post/:postId
    const postId = req.params.postId; // Mengambil postId yang diberikan dari url ':postId'

    BlogPost.findById(postId) // Mengambil data berdasarkan id yang didapatkan dari url
    .then( data => {
        if ( !data ) {
            const err = new Error ("Data tidak ditemukan");
            err.status = 422;
            throw err;
        }

        removeImage(data.image); // Meremove image lama yang akan diganti dengan image baru
        data.title = title;
        data.subTitle = subTitle;
        data.body = body;
        data.image = image;

        return data.save(); // Mengesave ulang data datanya
    } )
    .then ( result => {
        res.status(200).json({
            message: "Update success",
            data: result
        })
    } )
    .catch ( error => next(error))

}
// Mengeksport controller deleteBlog agar bisa digunakan di routes
exports.deleteBlog = (req, res, next) => {
    const postId = req.params.postId
    BlogPost.findById(postId)
    .then( post => {
        if(!post) {
            const err = new Error ('Blog Post tidatk ditemukan');
            err.errorStatus = 404;
            throw err;
        }
        removeImage(post.image); // Meremove image
        return BlogPost.findByIdAndRemove(postId); // Meremove data berdasrkan id
        
    } )
    .then( result => {
        res.status(200).json({
            message: "Hapus Blog Berhasil",
            data: result,
        })
    })
    .catch(error=> next(error))
}