const fs = require('fs');
const path = require('path');

const db=require('../database/models')
const {Op}=require('sequelize')
const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");



const controller = {
	index: (req, res) => {
		const productVisited= db.Product.findAll({
			where:{
				categoryId:1
			}
		})

		const productsInsale=db.Product.findAll({
			where:{
				categoryId:2
			}
		})


		Promise.all([productVisited,productsInsale])
			
			.then(([productVisited,productsInsale])=>{
				console.log(productVisited);
				res.render('index',{
					productVisited,
					productsInsale,
					toThousand
				})
			})
			.catch(error=>console.log(error))





	
	},
	// TAREA :HACER SEARCH
	search: (req, res) => {
		db.Product.findAll({
			
			where:{

				[Op.or]:{
					name:{
						[Op.substring]:req.query.keywords
					},
					description :{
						[Op.substring]:req.query.keywords
					}
				}
			}
		})
		
		.then(results=>{
			
			res.render('results',{
				results,
				toThousand,
				keywords:req.query.keywords
				
			})
		})
		
	},
};

module.exports = controller;