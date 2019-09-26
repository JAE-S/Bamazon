
  //───────────────────────────────────────────//
 //              Customer View                //
//───────────────────────────────────────────//

//──────── Format Node Packages ────────//
var chalk = require('chalk');
var colors = require('colors');
var Table = require('cli-table3');

//──────── Data Management Node Packages ────────//
var inquirer = require('inquirer');
var mysql = require('mysql');

//──────── Validation Node Packages ────────//
var Joi = require('joi'); 

//──────── Database connection ────────//
var connection = mysql.createConnection({
    host: "localhost", 

    port: 3306, 

    user: "root", 

    password: "12345678",
    database: "bamazon_db"

});

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + '\n');
    // If the connection to the database is successful the mainMenu function is called
    mainMenu();
});

//──────── Global Variables ────────//
var inventoryArr;
var shoppingList = [];
var newRow = []; 
var newAmount;
var table;

welcome()
function welcome(){
   console.log(chalk.greenBright(`
───────────────────────────────────────────────────────────────────────────────────────
                                        WELCOME TO
───────────────────────────────────────────────────────────────────────────────────────
    
                                                                                    
        _/                                                                         
        _/_/_/      _/_/_/  _/_/_/  _/_/      _/_/_/  _/_/_/_/    _/_/    _/_/_/    
        _/    _/  _/    _/  _/    _/    _/  _/    _/      _/    _/    _/  _/    _/   
        _/    _/  _/    _/  _/    _/    _/  _/    _/    _/      _/    _/  _/    _/    
        _/_/_/      _/_/_/  _/    _/    _/    _/_/_/  _/_/_/_/    _/_/    _/    _/     
                                                                            
    
───────────────────────────────────────────────────────────────────────────────────────
                    1 STOP SHOP FOR EVERYTHING FROM A-Z THAT YOU DON'T NEED
───────────────────────────────────────────────────────────────────────────────────────
                \n\n`));
}

// Create a table based on the data from the bamazon_db
function showProducts(){
console.log("\n─────────────────────────────────── P R O D U C T  I N V E N T O R Y ────────────────────────────────────\n".cyan);
    connection.query("SELECT * FROM products", function(err, res){
    if(err) throw err;
    var inventoryArr = [];
    var table = new Table({
        // Border
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
               , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
               , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
               , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
        // Headings
        head: [{hAlign:'center', content:"PRODUCT ID".cyan,vAlign:'center'}, 
                {hAlign:'center', content:"DEPARTMENT".cyan,vAlign:'center'}, 
               {hAlign:'center', content:"NAME".cyan,vAlign:'center'}, 
               {hAlign:'center', content:"DESCRIPTION".cyan,vAlign:'center'}, 
               {hAlign:'center', content:"STOCK".cyan,vAlign:'center'}, 
               {hAlign:'center', content:"PRICE".cyan,vAlign:'center'}],
        // Padding
        style: { 'padding-left': 1, 'padding-right': 1 },
        // Column Widths
        colWidths: [12, 12, 29, 29, 8, 8],
        // Wrap text in cells at column width 
        wordWrap: true
      });
      // For each product create a row with item_id, product_name, product_description, and price
      res.forEach(function(row) {
        let newRow = [
            {hAlign:'center', content:row.item_id, vAlign:'center'}, 
            {hAlign:'center', content:row.department_name, vAlign:'center'}, 
            {hAlign:'center', content:row.product_name, vAlign:'center'}, 
            {hAlign:'center', content:row.product_description, vAlign:'center'},
            {hAlign:'center', content:row.stock_quantity, vAlign:'center'}, 
            {hAlign:'left', content:"$" + row.price, vAlign:'center'}
        ]
        table.push(newRow)
      })
      console.log(table.toString() + "\n\n")
      mainMenu();
      });
 
}
// First function that prompts user to choose between the following options: "View Products", "Check Inventory, "Restock Inventory", "Add New Products", and "Exit"
function mainMenu(){
    inquirer.prompt([{
        prefix: "",
        type: "list",
        name: "mainMenu",
        message: "\nWhat would you like to do? Please select one of the options below.\n".cyan +"──────────────────────────────────────────────────────────────────\n".cyan,
        choices: ["View Products", "Check Inventory", "Restock Inventory", "Add New Products", new inquirer.Separator(), "Exit"]
    }]).then(function(res){
        commands(res.mainMenu);
    })
}

//──────── Switch statement for commands ────────//
function commands(name){
    switch (name){
        // Sows Inventory 
        case "View Products":
        showProducts();
        break; 
        // Promptes user to select an item 
        case "Check Inventory":
        checkInventory();
        break;
        // View cart
        case "Restock Inventory":
        restockInventory();
        break;
        // Completes order
        case "Add New Products":
        addProduct();
        break;
        // Exits the program
        case "Exit":
            exit();
        break; 
    }
}

//──────── Checks for products with a quantity of less than 5 ────────//
function checkInventory(){
    console.log("\n──────────────────────────── L O W  S T O C K ─────────────────────────────\n".cyan);
    connection.query("SELECT * FROM products WHERE stock_quantity <= 8", function(err, res){
        if(err) throw err;
        var inventoryArr = [];
        var table = new Table({
            // Border
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                    , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                    , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                    , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
            // Headings
            head: [{hAlign:'center', content:"PRODUCT ID".cyan,vAlign:'center'}, 
                    {hAlign:'center', content:"DEPARTMENT".cyan,vAlign:'center'}, 
                    {hAlign:'center', content:"NAME".cyan,vAlign:'center'}, 
                    {hAlign:'center', content:"STOCK".cyan,vAlign:'center'}, 
                    {hAlign:'center', content:"PRICE".cyan,vAlign:'center'}],
            // Padding
            style: { 'padding-left': 1, 'padding-right': 1 },
            // Column Widths
            colWidths: [12, 12, 29, 8, 8],
            // Wrap text in cells at column width 
            wordWrap: true
            });
            // For each product create a row with item_id, product_name, product_description, and price
            res.forEach(function(row) {
            let newRow = [
                {hAlign:'center', content:row.item_id, vAlign:'center'}, 
                {hAlign:'center', content:row.department_name, vAlign:'center'}, 
                {hAlign:'center', content:row.product_name, vAlign:'center'}, 
                {hAlign:'center', content:row.stock_quantity, vAlign:'center'}, 
                {hAlign:'left', content:"$" + row.price, vAlign:'center'}
            ]
            table.push(newRow)
            inventoryArr.push({item_id: row.item_id, product_name: row.product_name});
        })
        console.log(table.toString() + "\n\n")
        inquirer.prompt([{
            prefix: "",
            type: "confirm",
            name: "stock",
            message: "\nWould you like to update the inventory?\n".cyan +"───────────────────────────────────────".cyan,
            default: false
        }]).then(function(res){
            if (res.stock){
                restockInventory();
                } else if (!res.stock){
                mainMenu();
            }
        })
    });
}
//──────── Updates the SQL database to reflect the new quantity ────────//
function restockInventory(){
    console.log("\n──────────────────────────── RE-STOCK INVENTORY ─────────────────────────────\n".cyan);
    inquirer.prompt([
        {
            prefix: "", 
            type: "input", 
            message: "\n What product would you like to update? \n\n Please enter the item's ID",
            name: "itemId",
            validate: validateId
        },
        {   
            prefix: '',
            message: "\n Please enter the quantity: ",
            type: "input",
            name: "updateQuantity", 
            validate: validateStockQuantity,
            when: function(answers){
                return answers.itemId;
            }
        },
    
        ]).then(function(answers){

            connection.query("SELECT * FROM products", function(err, res){
                var newQuantity = parseFloat(res[answers.itemId-1].stock_quantity) + parseFloat(answers.updateQuantity);
              
                    connection.query(`UPDATE products SET stock_quantity = ${newQuantity} WHERE item_id = ${answers.itemId}`,
                    function(err, res){
                        if(err) throw err;
                    })
                });
                inquirer.prompt([{
                    prefix: "",
                    type: "confirm",
                    name: "stock",
                    message: "\n──────────── ITEM UPDATED ─────────────\n".green + "\nWould you like to update another item?\n───────────────────────────────────────".cyan,
                    default: false
                }]).then(function(res){
                    
                    if (res.stock){
                        restockInventory();
                        } else if (!res.stock){
                        mainMenu();
                    }
                })
            });
    // connection.query("SELECT * FROM products", function(err, res){
    // var newAmount = res[answers.itemId-1].stock_quantity - answers.quantity;
  
    //     connection.query(`UPDATE products SET stock_quantity = ${newAmount} WHERE item_id = ${answers.itemId}`,
    //     function(err, res){
    //         if(err) throw err;
    //     })
    // });
}
//──────── Adds an item to the inventory ────────//
// function addProduct(){
  
//     inquirer.prompt([
//     // Asks for the ID of a product
//     {
//         prefix: '',
//         message: "\n |Add Item| Enter an Item's ID: ",
//         type: "input",
//         name: "itemId", 
//         validate: validateId
//     }, 
//     // Ask how many units of the product the user would like to buy
//     {   
//         prefix: '',
//         message: "\n Please select a quantity: ",
//         type: "list",
//         name: "quantity", 
//         choices: [1, 2, 3, 4],
//         validate: validateStock,
//         when: function(answers){
//             return answers.itemId;
//         }
//     },
//     // Item added successfully 
//     {
//         prefix: '',
//         message: "\n ─────────── ITEM ADDED ────────────\n \n Would you like to add another item?".cyan,
//         type: "confirm",
//         name: "item_added", 
//         default: true

//     }]).then(function(answers){
//         connection.query(`SELECT * FROM products WHERE item_id = ${answers.itemId}`, function(err, res){
//             if(err) throw err;
//             shoppingList.push({item_Id: answers.itemId, 
//                                name: res[0].product_name, 
//                                price: res[0].price, 
//                                quantity: answers.quantity});
//         })
//         if (answers.item_added){
//             addItem();
//         } else if (!answers.item_added){
//             // console.log("please show my cart");
//             activeMenu();
//             return shoppingList;
//         }
//         // console.log(shoppingList);
//         updateStock(answers);
//     });
// }
//──────── Exit the App ────────//
function exit(){
    shoppingList = [];
    console.log("\n Good bye!\n"); 
    connection.end();
}

// Validates that the user input matches a product's ID 
function validateId(itemId){
    var schema = Joi.number().required().min(1).max(22);
    return Joi.validate(itemId, schema, onValidation); 
}
// Validates that the user input matches a product's ID 
function validateStockQuantity(updateQuantity){
    var schema = Joi.number().required().min(-20).max(200);
    return Joi.validate(updateQuantity, schema, onValidation); 
}

// Validates stock quantities 
// function validateStock(quantity){
    
//     connection.query("SELECT * FROM products", function(err, res){
//         if(err) throw err;
//         var newAmount = res[answers.itemId-1].stock_quantity - quantity.quantity;
//         if(newAmount >= 0){
//             console.log(newAmount)
//             return true || "The quantity you selected is unavailable at this time."; 
//         } 
//     });
// }
// Throws error message if validation is false 
function onValidation(err,val){
    if(err){
        console.log(err.message);
        return err.message;         
    }
    else{
        return true;            
    }
           
}

// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.