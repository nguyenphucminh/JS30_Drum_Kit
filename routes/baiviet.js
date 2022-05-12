var express = require('express');
var router = express.Router();
var ChuDe = require('../models/chude');
var BaiViet = require('../models/baiviet');

// GET: Danh sách bài viết
router.get('/', async function(req, res){
	var bv = await BaiViet.find()
	.populate('ChuDe')
	.populate('TaiKhoan').exec();
	res.render('baiviet', {
		title: 'Danh Sách Bài Viết',
		baiviet: bv
	})
});

// GET: Đăng bài viết
router.get('/them', async function(req, res){
	// Lấy chủ đề hiển thị vào form thêm
	var cd = await ChuDe.find();
	res.render('baiviet_them', {
		title:'Đăng Bài Viết',
		chude: cd
	});
});

// POST: Đăng bài viết
router.post('/them', async function(req, res){
	if(req.session.MaNguoiDung)
	{
		var data = {
			ChuDe: req.body.MaChuDe,
			TaiKhoan: req.session.MaNguoiDung,
			TieuDe: req.body.TieuDe,
			TomTat: req.body.TomTat,
			NoiDung: req.body.NoiDung
		};
		await BaiViet.create(data);
		req.session.success = "Đã đăng bài viết thành công và đang chờ kiểm duyệt";
		res.redirect('/success');
	}
	else{
		res.redirect('/dangnhap');
	}
});

// GET: Danh sách bài viết của tôi
router.get('/cuatoi', async function(req, res){
	if(req.session.MaNguoiDung)
	{
		var id = req.session.MaNguoiDung;
		var bv = await BaiViet.find()
		.populate('ChuDe')
		.populate({
			path: 'TaiKhoan',
			matchL: { _id:id}
		}).exec();
		res.render('baiviet_cuatoi',
		{
			title: 'Bài Viết Của Tôi',
			baiviet: bv
		});

	}
	else{
		res.redirect('/dangnhap');
	}
});

// GET: Sửa bài viết
router.get('/sua/:id', async function(req, res){
	var cd = await ChuDe.find();
	var id = req.params.id;
	var bv = await BaiViet.findById(id);
	res.render('baiviet_sua',
	{
		title: 'Sửa Bài Viết',
		chude: cd,
		baiviet:bv
	});
});

// POST: Sửa bài viết
router.post('/sua/:id', async function(req, res){
	var data ={
		ChuDe: req.body.MaChuDe,
		TieuDe: req.body.TieuDe,
		TomTat: req.body.TomTat,
		NoiDung: req.body.NoiDung
	}
	var id = req.params.id;
	await BaiViet.findByIdAndUpdate(id, data);
	req.session.success='Đã cập Nhật Bài Viết Thành Công Và Đang Chờ Kiểm Duyệt'
	res.redirect('/success');
});

// GET: Duyệt bài viết
router.get('/duyet/:id', async function(req, res){
	var id = req.params.id;
	var bv = await BaiViet.findById(id);
	await BaiViet.findByIdAndUpdate(id, {'KiemDuyet': 1- bv.KiemDuyet});
	res.redirect('back');
});

// GET: Xóa bài viết
router.get('/xoa/:id', async function(req, res){
	var id = req.params.id;
	await BaiViet.findByIdAndRemove(id);
	res.redirect('back');
});

module.exports = router;