// Mengimport mongoose
const mongoose = require('mongoose')
// Memanggil Schema untuk model yang akan digunakan untuk membuat skmea data ke database
const Schema = mongoose.Schema;

// Membuat Schema baru yaitu BlogPost yang didalamnya berisi data yang akan diperlukan dan data yang akan dikirim
const BlogPost = new Schema({
    // Dibawah adalah data-data yang diperlukan dan data-data yang akan dikirim
    // type => Menentukan jenis data
    // required => Menentukan apakah wajib(true) atau tidak(false)
    title: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required:true,
    },
    image: {
        type: String,
        required: true,
    },
    author: {
        type: Object,
        required: true
    }
}, {
    // Timestamp merupakan data yang akan mengirimkan created_at dan updated_at
    timestamps: true,
})

// Mengeksport module model BlogPost dari mongoose
module.exports = mongoose.model('BlogPost', BlogPost)