// Import express
const express = require('express');
// Membuat variabel app untuk menjalankan express karena express adalah function dan menambahkan () akan menjalankannya
const app = express();
// Menginstall dan mengimport library body-parser untuk menerima req.body yang dikirimkan oleh client
const bodyParser = require('body-parser');
// Menginstall dan mengimport library mongoose untuk mengkomunikasikan dengan database mongodb
const mongoose = require('mongoose')
// Menginstall Multer dan memanggil Multer untuk Proses Upload Image
const multer = require('multer')
// Mengimport Routes-routes yang dibutuhkan
const BlogRoutes = require('./src/routes/Blog');
const AuthRoutes = require('./src/routes/Auth');
// Mengimport path
const path = require('path')

// Membuat Penyimpanan gambar dari gambar yang di upload user
const fileStorage = multer.diskStorage({
    // Menentukan folder mana sebagai penyimpanan gambar yang di upload oleh user disini diletakkan di images
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // Ini memberikan namafile yang akan disimpan di destination
    filename: (req, file, callback) => {
        callback(null, new Date().getTime() + '-' + file.originalname)
    }
})

// Memfilter agar file yang dikirim user adalah image/gambar
const fileFilter = (req, file, callback) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        // Jika file-nya bertipe png,jpg,jpeg maka akan diizinkan
        callback(null, true)
    } else {
        // Ini sebaliknya
        callback(null, false)
    }
}

// Menjalankan body-parser dan menjalankan sebagai json
app.use(bodyParser.json())
// Membuat url static agar image dapat di akses dari luar
app.use('/images', express.static(path.join(__dirname, 'images')))
// Memanggil multer dan mengirimkan storage dan file filter yang sudah ditentukan
app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter
// Single berarti hanya gambar yang di upload dari data image yang sudah ditentukan 
}).single('image'))

// Mengizinkan Cors Police di browser
app.use((req, res, next) => {
    // Ini untuk mengizinkan url mana saja yang boleh mengakses API-nya(Tanda '*' menunjukan semua url bisa mengakases nya misalnya untuk codepen)
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Ini untuk mengizinkan method mana saja yang boleh untuk mengakses API 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    // Ini untuk Menentukan key header mana saja yang diperbolehkan di-dalam request
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Next untuk tetap melanjutkan proses
    next();
})
// Meng-instansiasi express kemudian menentukan url dan menjalankan routes yang dibutuhkan
app.use('/v1/auth', AuthRoutes);
app.use("/v1/blog", BlogRoutes);
// Meng-instansiasi express untuk menampilkan jika terjadi error yang sudah dibuat aturannya di routes
app.use((error, req, res, next) => {
    // Mengambil error status yang dikirim dari controller di routes jika terjadi error dan memberikan default error 500
    const status = error.errorStatus || 500;
    // Mengambil error message yang dikirim dari controller di routes jika terjadi error
    const message = error.message;
    // Mengambil error data yang dikirim dari controller di routes jika terjadi error
    const data = error.data;
    // Menetapkan status jika error dari variabel status
    res.status(status).json({
        // Mengirim message dari variabel message jika error
        message: message,
        // Mengirim data dari variabel data jika error
        data: data
    })
})
// Mengkoneksikan dengan database mongodb menggunakan monggoose
mongoose.connect('mongodb+srv://Raihan:YkYH8cfakIq33z8t@cluster0.e5bdn.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => {
    // Akan menjalankan server jika koneksi ke database berhasil 
    app.listen(4000, () => console.log('Coonection Success'));
})
.catch( err => 
    // Akan menampilkan error di console jika koneksi ke database gagal 
    console.log("error: ",err)
)
