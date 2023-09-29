const { error } = require('console');
const db = require('../database/models')
const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const controller = {
	// Root - Show all products
	index: (req, res) => {

		db.Product.findAll()
		.then(products=>{
			res.render('products', {
				products,
				toThousand
			})
		})
		.catch(error=>console.log(error))	
	},
	// Detail - Detail from one product
	detail: (req, res) => {

		db.Product.findByPk(req.params.id)
		.then(products=>{
			res.render('detail', {
				...products.dataValues,toThousand
			})
		})
		.catch(error=>console.log(error))

	},
	// Create - Form to create
	create: (req, res) => {

		db.Category.findAll()
		.then(categories=>{
			return res.render('product-create-form',{
				categories
			})
		})
		.catch(error=>console.log(error))
	},

	// Create -  Method to store
	store: (req, res) => {
		const {name,price,discount,categoryId,description,image} =req.body
		db.Product.create({
			name: name.trim(),
			price,
			discount,
			categoryId,
			description: req.body.description.trim(),
			image: req.file?req.file.filename:null
		})
		.then(product=>{
			console.log(product);
			res.redirect('/products')
		})
		.catch(error=>console.log(error))
	},

	// Update - Form to edit
	edit: (req, res) => {
		const categories= db.Category.findAll()
		const products= db.Product.findByPk(req.params.id)
		
		
		Promise.all([categories,products])
			.then(([categories,products])=>{
			res.render('product-edit-form', {
				...products.dataValues,
				categories
			})
		})
		.catch(error=>console.log(error))
	
	},
	// Update - Method to update
	update: (req, res) => {
		let {name,price,discount,categoryId,description,image}=req.body
	
		db.Product.findByPk(req.params.id,{
			attributes:['image']
		})
		.then(product=>{
			db.Product.update(
				{
					name ,
					price ,
					discount:discount||0 ,
					categoryId ,
					description ,
					image :req.file?req.file.filename:product.image
				
				},
				{
					where:{
						id:req.params.id
					}
				}
				)
				.then(respose=>{
					console.log(respose);
					return res.redirect('/')
				})
		})

		
				
	
		
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {


		db.Product.destroy({
			where:{
				id:req.params.id
			}
		})
		.then(response=>{
			console.log(response);
			return res.redirect('/products')
		})
		.catch(error=>console.log(error))
		

		
	}
};

module.exports = controller;