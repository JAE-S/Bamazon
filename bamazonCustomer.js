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
    // console.log("connected as id " + connection.threadId + '\n');
    // If the connection to the database is successful the mainMenu function is called
    mainMenu();
});

// Global variables
var inventoryArr;
var shoppingList = [];
var newRow = []; 
var newAmount;
var table;
var instock = false; 

// Create a table based on the data from the bamazon_db
function showProducts(){
console.log("\n───────────────────────────────── P R O D U C T S ─────────────────────────────────\n".cyan);
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
               {hAlign:'center', content:"NAME".cyan,vAlign:'center'}, 
               {hAlign:'center', content:"DESCRIPTION".cyan,vAlign:'center'}, 
               {hAlign:'center', content:"PRICE".cyan,vAlign:'center'}],
        // Padding
        style: { 'padding-left': 1, 'padding-right': 1 },
        // Column Widths
        colWidths: [12, 29, 29, 8],
        // Wrap text in cells at column width 
        wordWrap: true
      });
      // For each product create a row with item_id, product_name, product_description, and price
      res.forEach(function(row) {
        let newRow = [
            {hAlign:'center', content:row.item_id, vAlign:'center'}, 
            {hAlign:'center', content:row.product_name, vAlign:'center'}, 
            {hAlign:'center', content:row.product_description, vAlign:'center'},
            {hAlign:'left', content:"$" + row.price, vAlign:'center'}
        ]
        table.push(newRow)
        inventoryArr.push({item_id: row.item_id, product_name: row.product_name});
      })
      console.log(table.toString() + "\n\n")
    //   console.log(inventoryArr);
      menu();
      });
 
}
// First function that prompts user to choose between the following options: "View Products", "Shop", "Exit"
function mainMenu(){
    inquirer.prompt([{
        prefix: "",
        type: "list",
        name: "mainMenu",
        message: [chalk.green(`
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
            \n\n\n`) + "Please select one of the options below to begin!\n" +"────────────────────────────────────────────────\n"],
        choices: ["View Products", "Shop", new inquirer.Separator(), "Exit"]
    }]).then(function(res){
        commands(res.mainMenu);
    })
}
// Called from the showProducts function which prompts user to choose between the following options: "Shop" and "Exit"
function menu(){
    inquirer.prompt([{
        prefix: "",
        type: "list",
        name: "menu",
        message: [chalk.green("Excited about our products? Select the 'Shop' option below to continue!\n" +" ───────────────────────────────────────────────────────────────────────\n")],
        choices: ["Shop", new inquirer.Separator(), "Exit"] 
    }]).then(function(res){
        commands(res.menu);
    })
}
// Called from the addItem function which prompts user to choose between the following options: "Shop", "View Cart", "Check out", and "Exit"
function activeMenu(){
    inquirer.prompt([{
        prefix: "",
        type: "list",
        name: "active",
        message: [chalk.green("Please select one of the following options to continue: \n" +" ────────────────────────────────────────────────────────\n")],
        choices: ["Shop", "View Cart", "Check Out", new inquirer.Separator(), "Exit"] 
    }]).then(function(res){
        commands(res.active);
    })
}

// Switch statement for commads 
function commands(name){
    switch (name){
        // Sows Inventory 
        case "View Products":
        showProducts();
        break; 
        // Promptes user to select an item 
        case "Shop":
        addItem();
        break;
        // View cart
        case "View Cart":
        viewCart();
        break;
        // Completes order
        case "Check Out":
        checkOut();
        break;
        // Exits the program
        case "Exit":
            exit();
        break; 
    }
}

// Exits program
function exit(){
    shoppingList = [];
    console.log("\n Good bye!\n"); 
    connection.end();
}

// Add item to shopping list
function addItem(){
  
    inquirer.prompt([
    // Asks for the ID of a product
    {
        prefix: '',
        message: "\n |Add Item| Enter an Item's ID: ",
        type: "input",
        name: "itemId", 
        validate: validateId
    }, 
    // Ask how many units of the product the user would like to buy
    {   
        prefix: '',
        message: "\n Please select a quantity: ",
        type: "list",
        name: "quantity", 
        choices: [1, 2, 3, 4],
        validate: validateStock,
        when: function(answers){
            return answers.itemId;
        }
    },
    // Item added successfully 
    {
        prefix: '',
        message: "\n ─────────────── ITEM ADDED ───────────────\n \n Would you like to add another item?".cyan,
        type: "confirm",
        name: "item_added", 
        default: true

    }]).then(function(answers){
        connection.query(`SELECT * FROM products WHERE item_id = ${answers.itemId}`, function(err, res){
            if(err) throw err;
            shoppingList.push({item_Id: answers.itemId, 
                               name: res[0].product_name, 
                               price: res[0].price, 
                               quantity: answers.quantity});
        })
        if (answers.item_added){
            addItem();
        } else if (!answers.item_added){
            // console.log("please show my cart");
            activeMenu();
            return shoppingList;
        }
        // console.log(shoppingList);
        updateStock(answers);
    });
}

// Validates that the user input matches a product's ID 
function validateId(itemId){
    var reg = /^\d+$/;
    return reg.test(itemId) || "Please enter a valid product ID"
}

// Validates stock quantities 
function validateStock(quantity){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        var newAmount = res.stock_quantity - shoppingList[0].quantity;
        if(shoppingList[0].item_Id === res.itemId && newAmount >= 0){
            console.log(newAmount)
            return true || "The quantity you selected is unavailable at this time."; 
        } 
    });
}
// Updates the SQL database to reflect the remaining quantity
function updateStock(answers){
    connection.query("SELECT * FROM products", function(err, res){
    var newAmount = res[answers.itemId-1].stock_quantity - answers.quantity;
  
        connection.query(`UPDATE products SET stock_quantity = ${newAmount} WHERE item_id = ${answers.itemId}`,
        function(err, res){
            if(err) throw err;
        })
    });
}

// Once the update goes through, show the customer the total cost of their purchase.
function viewCart(answers){
        // showCart()
        console.log("\n────────────────────────────── MY CART ───────────────────────────────\n".cyan);
        var table = new Table({
            // Border
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                   , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                   , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                   , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
            // Headings
            head: [{hAlign:'center', content:"PRODUCT ID".cyan,vAlign:'center'}, 
                   {hAlign:'center', content:"NAME".cyan,vAlign:'center'}, 
                   {hAlign:'center', content:"QUANTITY".cyan,vAlign:'center'}, 
                   {hAlign:'center', content:"PRICE".cyan,vAlign:'center'}],
            // Padding
            style: { 'padding-left': 1, 'padding-right': 1 },
            // Column Widths
            colWidths: [12, 29, 12, 12],
            // Wrap text in cells at column width 
            wordWrap: true
          });
          // For each product create a row with item_id, product_name, product_description, and price
          shoppingList.forEach(function(row) {
             newRow = [
                {hAlign:'center', content: row.item_Id, vAlign:'center'}, 
                {hAlign:'center', content: row.name, vAlign:'center'}, 
                {hAlign:'center', content: row.quantity, vAlign:'center'}, 
                {hAlign:'left', content:"$" + row.price, vAlign:'center'}
            ]
            table.push(newRow)
          })
          console.log(table.toString() + "\n\n")
        //   console.log(inventoryArr);
          activeMenu();
    }
      
function checkOut(){
   var finalTotal = 0; 
  
    for (var i = 0; i < shoppingList.length; i++){
       var itemTotal = shoppingList[i].price * shoppingList[i].quantity;
        finalTotal = itemTotal + finalTotal;

    }
    // finalCost = itemTotal++;
    console.log("Your total is: $" + finalTotal)
}
