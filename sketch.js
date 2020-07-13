var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;

function preload(){
sadDog=loadImage("Images/happydog.png");
happyDog=loadImage("Images/Dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1250,600);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("FEED THE DOG");
  feed.position(1080,390);
  feed.mousePressed(feedDog);

  addFood=createButton("ADD MILK");
  addFood.position(1200,390);
  addFood.mousePressed(addFoods);

}
function draw() {
  background("green");
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(25);
  if(lastFed>=12){
    fill("red");
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     fill("red")
     text("Last Feed : 12 AM",350,30);
   }else{
     fill("pink");
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}