var express = require('express');
var router = express.Router();
var firstImage = require('../firstimage');
var ChuDe = require('../models/chude');
var BaiViet = require('../models/baiviet');

// GET: Trang chủ
router.get('/', async function(req, res){
	var cd = await ChuDe.find();
	var bv = await BaiViet.find({KiemDuyet: 1})
		.populate('ChuDe')
		.populate('TaiKhoan').exec();
	res.render('index', {
		title: 'Trang chủ',
		chude: cd,
		baiviet: bv,
		firstImage: firstImage
	});
});

// GET: Xem bài viết
router.get('/baiviet/chitiet/:id', async function(req, res){
	var id = req.params.id;
	var bv = await BaiViet.findById(id)
		.populate('ChuDe')
		.populate('TaiKhoan').exec();
	res.render('baiviet_chitiet',
	{
		baiviet:bv
	});
});

// GET: Tin mới nhất
router.get('/tinmoinhat', async function(req, res){
	res.render('tinmoinhat', { title: 'Tin mới nhất' });
});

// POST: Kết quả tìm kiếm
router.post('/timkiem', async function(req, res){
	var tukhoa = req.body.tukhoa;
	var bv = null;
	res.render('timkiem', {
		title: 'Kết quả tìm kiếm',
		baiviet: bv
	});
});

// GET: Lỗi
router.get('/error', async function(req, res){
	res.render('error', { title: 'Lỗi' });
});

// GET: Thành công
router.get('/success', async function(req, res){
	res.render('success', { title: 'Hoàn thành' });
});

module.exports = router;