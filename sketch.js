let foods = [];

function setup() {
	width = windowWidth;
	height = windowHeight;
	createCanvas(width, height);
	
	angleMode(DEGREES);
	let normalR = createVector(-1,0);
	
	mob = new Mob();
	for(let i = 0; i < 10; i++){
		foods.push(new Food());
	}
}

function draw() {
	background(50,105,200);
	for(let i = 0; i < foods.length; i++){
		foods[i].display();
		if(mob.canEat(foods[i]) & mob.health < mob.maxHealth){
			//foods.splice(i,1);
			foods[i].pos = createVector(random(30,width - 30), random(30,height - 30));
			i--;
			mob.health += 3.5;
		}
	}
	mob.display();
	mob.move();
}
//////
class Entity{
	constructor(){
		this.pos = createVector(width/2,height/2);
		this.size = 50;
	}
}
//////
class Mob extends Entity {
	constructor(){
		//give position and size
		super();
		//Direction Mob is moving
		this.direction = createVector(1,0);
		////Movement variable
		this.velocity = createVector(0,0);
		this.defaultAcc = .1;
		this.speed = 0;
		this.maxSpeed = 15;
		
		this.health = 30;
		this.maxHealth = 100;
	}
	
	display(){
		push();
		//Displaying the main body
		strokeWeight(3);
		fill("white");
		ellipse(this.pos.x, this.pos.y, this.size);
		if (this.health < 20){
			fill("Red");
		}else{
			fill("Green");
		}
		//Display and subtract health over time
		rect(this.pos.x - this.health/2, this.pos.y - this.size/1.2, this.health, 10);
		pop();
		if(this.health > 0){
			this.health -= .05;
		}else{
			//If health drops to 0 lock mob in place
			this.pos = createVector(0,0);
			this.direction = createVector(0,-1);
			push();
			strokeWeight(2);
			stroke("Black");
			fill("Red");
			textSize(60);
			textAlign(CENTER);
			text("Game Over", width/2, height/2)
			pop();
		}
		//Points in the direction the mob is facing
		strokeWeight(3);
		line(this.pos.x, this.pos.y, this.pos.x + this.direction.x*50, this.pos.y + this.direction.y*50);
	}
	
	move(){
		this.speed = this.velocity.mag();
		this.pos.add(this.speed * this.direction.x, this.speed * this.direction.y);
		
		//I couldn't think of a better way to make sure the direction and velocity are pointing in the same direction
		if (this.velocity.x * this.direction.x < 0){
			this.velocity.x *= -1;
		}
		if (this.velocity.y * this.direction.y < 0){
			this.velocity.y *= -1;
		}
		//Accelerating entitity
		//keyCode 87 is w 38 is up arrow
		if (keyIsDown(87) || keyIsDown(38)) {
			if (this.speed < this.maxSpeed) {
				this.velocity.x += this.defaultAcc * this.direction.x;
				this.velocity.y += this.defaultAcc * this.direction.y;
			}else{
				print("Maximum Speed Achieved")
			}
		}
	//Decelerating Entity
		//keyCode 83 is s 40 is down arrow
		else if (keyIsDown(83) || keyIsDown(40)){
			this.velocity.x -= this.defaultAcc * this.direction.x * 5;
			this.velocity.y -= this.defaultAcc * this.direction.y * 5;
		}
	//Rotating Entity
		//keyCode 65 is a 37 is up arrow
		if (keyIsDown(65) || keyIsDown(37)) {
			this.direction.rotate(-4);
		//keyCode 68 is d 39 is up arrow
		}else if (keyIsDown(68) || keyIsDown(39)) {
			this.direction.rotate(4);
		}
		
	//Boundaries
		//X direction
		if (this.pos.x > width - this.size/2 || this.pos.x < this.size/2){
			//If it hits a wall switch the sign on the velocity's x component
			this.direction.x *= -1;
			//Make sure the Entity does not get stuck inside the wall constantly switching sign on velocity
			//Right
			if (this.pos.x > width - this.size/2){
				this.pos.x = width - this.size/2 - 10;
			//Left
			}else if (this.pos.x < this.size/2){
				this.pos.x = this.size/2 + 10;
			}else{}
			
			
		}else{}
		//Y direction
		if (this.pos.y > height - this.size/2 || this.pos.y < this.size/2){
			//If it hits a wall switch the sign on the velocity's y component
			this.direction.y *= -1;
			//Make sure the Entity does not get stuck inside the wall constantly switching sign on velocity
			//Bottom
			if (this.pos.y > height - this.size/2){
				this.pos.y = height - this.size/2 - 10;
			//Top
			}else if(this.pos.y < this.size/2){
				this.pos.y = this.size/2 + 10;
			}else{}
		}else{}
	}
	
	canEat(food){
		if(dist(this.pos.x, this.pos.y, food.pos.x, food.pos.y) < (this.size/2 + food.size)){
			print("can eat: " + food);
			return true;
		}else{
			return false;
		}
	}
}
///////
class Food extends Entity{ 
	constructor(){
		super();
		this.size = 15;
		this.pos = createVector(random(30,width - 30), random(30, height  - 30));
	}
	
	display(){
		push();
		strokeWeight(0);
		fill(85, 255, 61);
		//noFill();
		ellipse(this.pos.x, this.pos.y, this.size);
		pop();
		
	}
}

function keyPressed() {
	//keyCode 32 is space
	if (keyCode == 32){
        print("\nX:\t" + floor(mob.pos.x) +
			  "\nY:\t" + floor(mob.pos.y) +
			  "\nX Velocity:\t" + mob.velocity.x + 
			  "\nY Velocity:\t" + mob.velocity.y + 
			  "\nSpeed:\t" + floor(mob.speed) + 
			  "\nAngle:\t" + mob.direction.heading() + 
			  "\nDirection:\t(" + mob.direction.x + "," + mob.direction.y + ")");
		
    }
}