// ### Challenge #1: Customer View (Minimum Requirement)

var chalk = require('chalk');
var colors = require('colors');

var Table = require('cli-table3');

var inquirer = require('inquirer');

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost", 

    port: 3306, 

    user: "root", 

    password: "12345678",
    database: "bamazon_db"

});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + '\n');
    welcome();
});

// Global variables
var product_id = [];
var product_name = [];
var product_description = [];
var price = [];
var table;

function welcome(){
    console.log(chalk.green(`
───────────────────────────────────────────────────────────────────────────────────
                                    WELCOME TO
───────────────────────────────────────────────────────────────────────────────────

                                                                                
    _/                                                                         
    _/_/_/      _/_/_/  _/_/_/  _/_/      _/_/_/  _/_/_/_/    _/_/    _/_/_/    
    _/    _/  _/    _/  _/    _/    _/  _/    _/      _/    _/    _/  _/    _/   
    _/    _/  _/    _/  _/    _/    _/  _/    _/    _/      _/    _/  _/    _/    
    _/_/_/      _/_/_/  _/    _/    _/    _/_/_/  _/_/_/_/    _/_/    _/    _/     
                                                                        

───────────────────────────────────────────────────────────────────────────────────
              1 STOP SHOP FOR EVERYTHING FROM A-Z THAT YOU DON'T NEED
───────────────────────────────────────────────────────────────────────────────────
    \n`))
    showProducts();
    // products();
}

// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

function showProducts(){
console.log("\n───────────────────────────────── P R O D U C T S ─────────────────────────────────\n".cyan);
    connection.query("SELECT * FROM products", function(err, res){
    if(err) throw err;
    // instantiate
    let productsArr = [];
    var table = new Table({
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
               , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
               , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
               , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
        head: [{hAlign:'center', content:"PRODUCT ID".cyan,vAlign:'center'}, {hAlign:'center', content:"NAME".cyan,vAlign:'center'}, {hAlign:'center', content:"DESCRIPTION".cyan,vAlign:'center'}, {hAlign:'center', content:"COST".cyan,vAlign:'center'}],
        style: { 'padding-left': 1, 'padding-right': 1 },
        colWidths: [12, 29, 29, 8],
        vAlign: 'center',
        wordWrap: true
      });
      res.forEach(function(row) {
        let newRow = [
            {hAlign:'center', content:row.item_id, vAlign:'center'}, 
            {hAlign:'center', content:row.product_name, vAlign:'center'}, 
            {hAlign:'center', content:row.product_description, vAlign:'center'},
            {hAlign:'left', content:"$" + row.price, vAlign:'center'}
        ]
        table.push(newRow)
        // productsArr.push(row.item_id)
      })
      console.log(table.toString())
           
      connection.end();
      });
 
    //   console.log(table.toString());
}

// function products(){
// connection.query("SELECT * FROM products", function(err, res){
//     if(err) throw err;
//     for (var i = 0; i < res.length; i++){
//         product_id = res[i].item_id;
//         product_name = res[i].product_name;
//         product_description = res[i].product_description;
//         price = res[i].price;
//         console.log(product_id + product_name + product_description + price);
//     }
//     showProducts()
//     connection.end();
// });
// }
// var constructProduct = function(completeObject){
//     for(var i = 0; i < 1; i++){
//         completeObject.product = completeObject.product.push('[product_id]', res[i].item_id)
//     }
// }

// function products(product_id, product_name, product_description, price){
//     this.product_id = product_id;
//     this.product_name = product_name;
//     this.product_description = product_description;
//     this.price = price; 

//     this.inventory = showProducts(); 
//     console.log("I am the inventory" + this.inventory)
// }

// function products(){
//     inquirer.prompt([{
//         type: "checkbox",
//         name: "products",
//         message: ""
//     }])
// }



// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.
