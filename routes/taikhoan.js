var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const { required } = require('nodemon/lib/config');
var saltRounds = 10;
var TaiKhoan = require('../models/taikhoan');

// GET: Danh sách tài khoản
router.get('/', async function(req, res){
	var tk = await TaiKhoan.find();
    res.render('taikhoan',
    {
        title:'Danh Sách Tài Khoản',
        taikhoan: tk
    })
});

// GET: Thêm tài khoản
router.get('/them', async function(req, res){
	res.render('taikhoan_them', {title:'Thêm Tài Khoản'});
});

// POST: Thêm tài khoản
router.post('/them', async function(req, res){
	var data = {
    HoVaTen: req.body.HoVaTen,
    Email: req.body.Email,
    HinhAnh: req.body.HinhAnh,
    TenDangNhap: req.body.TenDangNhap,
    MatKhau: bcrypt.hashSync(req.body.MatKhau, saltRounds)
    };
    await TaiKhoan.create(data);
    res.redirect('/taikhoan');

});

// GET: Sửa tài khoản
router.get('/sua/:id', async function(req, res){
    var id = req.params.id;
    var tk = await TaiKhoan.findById(id);
    res.render('taikhoan_sua', {
        title: 'Sửa Tài Khoản',
        taikhoan: tk
    })
});

// POST: Sửa tài khoản
router.post('/sua/:id', async function(req, res){
    var data = 
    {
        HoVaTen: req.body.HoVaTen,
        Email: req.body.Email,
        HinhAnh: req.body.HinhAnh,
        TenDangNhap: req.body.TenDangNhap,
        QuyenHan: req.body.QuyenHan,
        KichHoat: req.body.KichHoat
    }
    if(req.body.MatKhau)
    {
        data['MatKhau'] = bcrypt.hashSync(req.body.MatKhau, saltRounds);
    }
    var id = req.params.id;
    await TaiKhoan.findByIdAndUpdate(id,data);
    res.redirect('/taikhoan')
});

// GET: Xóa tài khoản
router.get('/xoa/:id', async function(req, res){
	var id = req.params.id;
    await TaiKhoan.findByIdAndRemove(id);
    res.redirect('/taikhoan');
});

module.exports = router;