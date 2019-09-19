Drop database if exists bamazon_db; 
-- MySQL Database called `bamazon`--
create database bamazon_db;

use bamazon_db;
-- Then create a Table inside of that database called `products` --
create table products (
    -- item_id (unique id for each product) -- 
    item_id int not null auto_increment, 
    -- product_name (Name of product) --
    product_name varchar(80) null, 

    department_name varchar(80) null, 
    
    product_description varchar(160) null, 

    -- price (cost to customer)--
    price decimal(10,2) null,

    -- stock_quantity (how much of the product is available in stores) --
    stock_quantity integer(6) null, 
    primary key(item_id)
);

    INSERT INTO products(product_name, department_name, product_description, price, stock_quantity)
    VALUES ("Blisterine", "Health & Wellness", "Monster mouthwash - fries germs on contact", 6.59, 250), 
            ("Crust Tooth Paste - 4.1oz", "Health & Wellness", "Garlic flavored tooth paste", 6.99 , 300), 
            ("Jerkins - Wild Soap", "Health & Wellness", "Cleans up dirty words", 6.50, 300), 
            ("Copperbone", "Health & Wellness", " Suntan lotion for skeletons - for a chrome colored dome", 12.00, 40), 
            ("Hawaiian Punks - 2PK/12 FL OZ Cans", "Beverages", "Bloody nose red - beats you to a fruit juicy pulp", 4.49, 200), 
            ("Slopicana 100% Peels - 1.8 Quart, 59 FL OZ", "Beverages", "Orangutan juice", 3.57, 100), 
            ("Pupsi Cola - 12PK/ 12 FL OZ Cans", "Beverages", "The soft drink for dogs", 4.89, 200), 
            ("CAP’N CRUD", "Cereal", "Cereal that tastes cruddy - even in milk", 2.89, 80), 
            ("Cheapios", "Cereal", "Generally soggy cereal - lots of holes in every package", 2.99, 80), 
            ("All-Brain", "Cereal", "The cereal the goes to your head", 2.99, 80), 
            ("Uncle Bum's", "Grains", "Convicted rice - preferred by panhandlers-freeloaders and hobos in jails", 3.99, 140), 
            ("Quacker Oats", "Grains", "Strictly for the birds", 3.49, 100), 
            ("Chef Girl-ar-dee 15 OZ", "Grains", "Feminist spaghetti", 0.99, 100), 
            ("Tipsy Roll Pop", "Sweets", "200 Proof - For real suckers", 0.99, 80), 
            ("Stickers Bar", "Sweets", "The desert candy - chocolate covered cactus", 0.99, 80), 
            ("Hostile Thinkies", "Sweets", "Brain filled pastries", 9.99, 60), 
            ("Playbug", "Magazines", "Entertainment for insects", 1.00, 8), 
            ("National Geografink", "Magazines", "VOL. MCVXYZZ | Lion hunting in Africa", 12.00, 8), 
            ("Shorts Illustrated", "Magazines", "Size 60 | Fashion... Worlds longest long johns", 5.99, 8), 
            ("Dirtycell", "Misc.", "Battery for prisoners", 1.40, 60), 
            ("Koduck", "Misc.", "Film for Ducks", 8.00, 40), 
            ("Play-Dumb", "Misc.", "Moldy Clay", 4.60, 20);
            
	SELECT * FROM products;