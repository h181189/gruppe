// Housekeeping

class Configuration { 

	// Configuration

	static canvasHeight() {
		// Height of board.
		// The canvas height must be
		// divisible by the tile height
		const canvasHeight = 600;
		return canvasHeight;
	}

	static canvasWidth() {
		// Width of board.
		// The canvas width must be
		// divisible by the tile width
		const canvasWidth = 600;
		return canvasWidth;
	}

	static backgroundColor() {
		// Background color of the board
		const backgroundColor = "#EEEEEE";
		return backgroundColor;
	}

	static foodColor() {
		// Color of the food
		const foodColor = '#DD5555';
		return foodColor;
	}

	static initialNumberOfTails() {
		// Initial number of tails a player has
		const initialNumberOfTails = 4;
		return initialNumberOfTails;
	}

	static numberOfFood() {
		// Number of foods at the same time on the board
		const numberOfFood = 2;
		return numberOfFood;
	}

	static playerHeadColor() {
		// Snake's head color
		const playerHeadColor = '#336699';
		return playerHeadColor;
	}

	static playerTailColor() {
		// Snake's tail color
		const color = '#7799BB';
		return color;
	}

	static playerShade() {
		// How much darker a tail 
		// should be than the one before it.
		const shade = '#111111';
		return shade;
	}

	static refreshRate() {
		// many times the game
		// should render per second
		const refreshRate = 12;
		return refreshRate;
	}

	static tileSize() {
		// Width and height of tiles.
		// tileSize mod canvasHeight and canvasWidth should be 0
		const tileSize = 25;
		return  tileSize;
	}

	static keyDown() {
		// Key pressed to turn down
		// 40 - down arrow, s - 115
		const keyDown = 40;
		return keyDown;
	}

	static keyLeft() {
		// Key pressed to turn left
		// 37 - left arrow, 97 - 'a'
		const keyLeft = 37;
		return keyLeft;
	}

	static keyUp() {
		// key pressed to turn up
		// 38 - up arrow, 119 - 'w'
		const keyUp = 38;
		return keyUp;
	}

	static keyRight() {
		// key pressed to turn right
		// 39 - right arrow, 100 - 'd'
		const keyRight = 39;
		return keyRight;
	}
}

class Validate {

	// Validation
	// Typically checks:
	//	1. Is parameter undefined
	//	2. Is parameter assumed type
	//	3. Is parameter's constructor or instanceof assumed type

	static isArray(array) {
		if (array === undefined) { return false; }
		if (typeof array !== 'object') { return false; }
		if (array.constructor !== Array) { return false; }
		return true;
	}

	static isBoolean(boolean) {
		if (boolean === undefined) { return false; }
		if (typeof boolean !== 'boolean') { return false; }
		return true;	}

	static isCanvas(canvas) {
		if (canvas === undefined) { return false; }
		if (typeof canvas !== 'object') { return false; }
		if (canvas.constructor !== HTMLCanvasElement) { return false; }
		return true;
	}

	static isEntity(entity) {
		if (entity === undefined) { return false; }
		if (typeof entity !== 'object') { return false; }
		if (!entity instanceof Entity) { return false; }
		return true;
	}

	static isEntityTable(table) {
		// Checks if parameter is an EntityTable
		if (table === undefined) { return false; }
		if (typeof table !== 'object') { return false; }
		if (!table instanceof EntityTable) { return false; }
		return true;
	}

	static isHTMLElement(element) {
		// Checks if parameter is an HTMLElement
		if (element === undefined) { return false; }
		if (typeof element !== 'object') { return false; }
		if (element instanceof HTMLElement) { return false; }
		return true;
	}

	static isInteger(number) {
		if (number === undefined) { return false; }
		if (typeof number !== 'number') { return false; }
		if (number % 1 !== 0) { return false; }
		return true;
	}

	static isNaturalNumber(number) {
		if (!Validate.isInteger(number)) { return false; }
		if (number < 0) { return false; }
		return true;
	}

	static isStage(stage) {
		if (stage === undefined) { return false; }
		if (typeof stage !== 'object') { return false; }
		if (!stage instanceof Stage) { return false; }
		return true;
	}

	static isString(string) {
		if (string === undefined) { return false; }
		if (typeof string !== 'string') { return false; }
		if (string.length === 0) {  return false; }
		return true;
	}
}

class Profile {

	static getAlltimeScore() {
		if (typeof(Storage) !== undefined) {
			if (localStorage.getItem("score") === null) {
				Profile.setAlltimeScore(0);
			}
			return localStorage.getItem("score");
		}
	}

	static setAlltimeScore(value) {
		localStorage.setItem("score", value);
	}

}

// Entities

class Entity {
	constructor(x, y, size, color) {
		if (!Validate.isInteger(x)) { throw new Error('x is not an integer: ' + x); }
		if (!Validate.isInteger(y)) { throw new Error('y is not an integer: ' + y); }
		if (!Validate.isNaturalNumber(size)) { throw new Error('size is not a natural number: ' + size); }
		if (!Validate.isString(color)) { throw new Error('color is not a real color: ' + color); }

		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.size = size;
		this.color = color;
	}

	collides(target) {
		// Checks if the entities are on the same tile
		const collideX = this.x === target.x;
		const collideY = this.y === target.y;
		return collideX && collideY;
	}

	update() {}
}

class RootEntity extends Entity {
	// Entities that are root entities
	// will record every position troughout the game.
	// Their position should not be depending on any
	// other entity in the game.
	constructor(x, y, size, color) {
		super(x, y, size, color);
		// In a future update, previousPositions will be
		// a key variable to create a live video of a game
		// because it records every position of every independent entity
		this.previousPositions = [];
	}

	update() {
		this.x += this.vx;
		this.y += this.vy;

		this.previousPositions.unshift([this.x, this.y]);
	}
}

class Food extends RootEntity {
	constructor(entities) {
		super(0, 0, Configuration.tileSize(), Configuration.foodColor());

		this.respawn(entities);
	}

	respawn() {
		this.x = this._getRandomPosition(Configuration.canvasWidth());
		this.y = this._getRandomPosition(Configuration.canvasHeight());
	}

	_getRandomPosition(bound) {
		return Math.round(Math.random() * (bound / this.size - 1)) * (this.size);
	}
}

class Player extends RootEntity {
	constructor() {
		super(0, 0, Configuration.tileSize(), Configuration.playerHeadColor());

		this.numberOfTails = Configuration.initialNumberOfTails(); // Number of tails is set to the intial number of tails
		this.vx = Configuration.tileSize(); // The initial velocity
	}
}

class PlayerTail extends Entity {
	constructor(player, tailNumber) {
		super(0, 0, Configuration.tileSize(), Configuration.playerTailColor());
		this.player = player;
		this.tailNumber = tailNumber;
		// Sets the color of the snake
		this.setColor(tailNumber);
	}

	setColor(shadeMultiplier) {

	}

	update() {
		const position = this.player.previousPositions[this.tailNumber - 1];
		if (position !== undefined) {
			this.x = position[0];
			this.y = position[1];
		}
	}
}

class EntityTable {
	constructor() {
		this.entities = [];
		this.player = null;
		this.tails = [];
		this.foods = [];

		for (let i = 0; i < Configuration.numberOfFood(); i++)
			this.add(new Food());
	}

	add(entity) {
		if (!Validate.isEntity(entity)) { throw new Error('entity is not an instance of entity:' + entity); }

		// Sorts entity into the following lists, and finally adds them to an array for all of the arrays
		switch (entity.constructor) {
			case Player:
				this.player = entity;
				for (let numberOfTails = 0; numberOfTails < this.player.numberOfTails; numberOfTails++) {
					this.add(new PlayerTail(this.player, numberOfTails + 1));
				}
				break;
			case PlayerTail:
				this.tails[this.tails.length] = entity;
				break;
			case Food:
				this.foods[this.foods.length] = entity;
				break;
			default:
				throw new Error('cannot recognize entity type: ' + entity.constructor);
		}
		this.entities[this.entities.length] = entity;
	}

	update() {
		const food = Game.playerEatsFood(this.player, this.foods);
		if (food !== null) {
			this.player.numberOfTails++;
			this.add(new PlayerTail(this.player, this.player.numberOfTails));
			Game.respawnFood(food, this.entities);
			const score = this.player.numberOfTails - Configuration.initialNumberOfTails();
			WriteScreen.writeScore(score);
			if (score > Profile.getAlltimeScore()) {
				Profile.setAlltimeScore(score);
			}
			WriteScreen.writeAlltime(score);
		}

		for (const entity of this.entities) {
			entity.update();
		}
	}
}

// Event listeners and handlers

class KeyListener {
	constructor() {
		this.keys = [];

		const self = this; // Stores 'this' in a variable to make it accessible outside of its scope
		window.addEventListener('keydown', function(evt) {
			self._keydown(evt.keyCode);
		});

		window.addEventListener('keyup', function(evt) {
			self._keyup(evt.keyCode);
		});
	}

	_keydown(keyCode) {
		// If key does not exist in array, add it
		if (this.keys.indexOf(keyCode) === -1) {
			this.keys[this.keys.length] = keyCode;
		}
	}

	_keyup(keyCode) {
		// If key exist in array, remove it
		this.keys.splice(this.keys.indexOf(keyCode), 1);
	}

	addCallback(event, callback, object) {
		window.addEventListener(event, function() {
			callback(object);
		});
	}
}

class ControlPlayer {
	constructor(player, left, up, right, down) {
		if (!Validate.isEntity(player) && player.constructor !== Player) { throw new Error('player is not a player: ' + player); }

		this.player = player;
		this.positions = new Array(2);

		this.left = left;
		this.up = up;
		this.right = right;
		this.down = down;

		const listener = new KeyListener();
		this.keys = listener.keys;
		this.nextTurn = this.right;

		listener.addCallback('keydown', this._turn, this);
	}

	_turn(self) {
		self.nextTurn = self.keys[self.keys.length - 1];
	}

	_getDirection() {
		// Finds the current direction by calculating
		// the difference between current and previous position

		let direction = -1;
		const curPos = this.positions[0];
		const prevPos = this.positions[1];

		if (curPos[0] < prevPos[0]) {
			direction = this.left;
		} else if (curPos[0] > prevPos[0]) {
			direction = this.right;
		} else if (curPos[1] < prevPos[1]) {
			direction = this.up;
		} else if (curPos[1] > prevPos[1]) {
			direction = this.down;
		}
		return direction;
	}

	turnPlayer() {
		if (this.positions[1] !== undefined) {
			const p = this.player;
			const direction = this._getDirection();

			// If current direction is not opposite of requested
			// direction, then change velocity according to request
			switch (this.nextTurn) {
				case this.left:
					if (direction !== this.right) {
						p.vx = - Configuration.tileSize();
						p.vy = 0;
					}
					break;
				case this.up:
					if (direction !== this.down) {
						p.vx = 0;
						p.vy = - Configuration.tileSize();
					}
					break;
				case this.right:
					if (direction !== this.left) {
						p.vx = Configuration.tileSize();
						p.vy = 0;
					}
					break;
				case this.down:
					if (direction !== this.up) {
						p.vx = 0;
						p.vy = Configuration.tileSize();
					}
					break;
			}
		}
	}

	updatePlayerPositions() {
		// Stores current position at the 
		// beginning of an array and removes last 
		// element of array, as there will be no need for it anymore
		this.positions.unshift([this.player.x, this.player.y]);
		this.positions.splice(this.positions.length - 1, 1);
	}
}

class WriteScreen {

	static writeScore(score) {
		document.getElementById('score').innerHTML = score;
	}

	static writeAlltime() {
		document.getElementById("alltime-score").innerHTML = Profile.getAlltimeScore();
	}

}

// Checks

class Game {

	static crashInWall(entity) {
		if (!Validate.isEntity(entity)) { throw new Error('entity is not an instance of an entity: ' + entity) }

		// Checks if entity is beyond its limits

		const farLeft = entity.x < 0;
		const farRight = entity.x + entity.size > Configuration.canvasWidth();
		const farTop = entity.y < 0;
		const farBottom = entity.y + entity.size > Configuration.canvasHeight();
		return farLeft || farRight || farTop || farBottom;
	}

	static eatTail(player, tails) {
		if (!Validate.isEntity(player)) { throw new Error('player is not an instance of entity: ' + player)}
		for (const tail of tails) {
			if (player.collides(tail) && tail.constructor !== Player) {
				return true;
			}
		}
		return false;
	}

	static playerEatsFood(player, foods) {
		if (!Validate.isEntity(player)) { throw new Error('player is not an instance of Entity: ' + player); }
		if (!Validate.isArray(foods)) { throw new Error('foods is not an array: ' + foods); }

		for (const food of foods) {
			if (player.collides(food) && player !== food) {
				return food;
			}
		}
		return null;
	}

	static isGameOver(entityTable) {
		const player = entityTable.player;
		return Game.crashInWall(player) || Game.eatTail(player, entityTable.tails);
	}

	static _overlaps(entity, targets) {
		for (const target of targets) {
			if (entity.collides(target) && entity !== target) {
				return true;
			}
		}
		return false;
	}

	static respawnFood(food, entities) {
		while (this._overlaps(food, entities)) {
			food.respawn();
		}
	}
}

// Stages and scenes

class Stage {
	constructor(ctx) {
		this.ctx = ctx;
		this.continue = true;
	}

	update() { }

	draw() { }

	render() {
		this.update();
		if (this.continue) {
			this.draw();
		} else {
			this.stopRender();
		}
	}

	stopRender() { }
}

class DynamicStage extends Stage {
	constructor(ctx) {
		super(ctx);

		this.entityTable = new EntityTable();
		const player = new Player();
		const controller = new ControlPlayer(player, Configuration.keyLeft(), Configuration.keyUp(), Configuration.keyRight(), Configuration.keyDown());
		this.entityTable.add(player);

		const self = this;
		this.draw();
		this.game = setInterval(function() {
			controller.updatePlayerPositions();
			controller.turnPlayer();
			self.render();
		}, 1000 / Configuration.refreshRate());
	}


	draw() {
		const ctx = this.ctx;
		ctx.fillStyle = Configuration.backgroundColor();
		ctx.beginPath();
		ctx.fillRect(0, 0, Configuration.canvasWidth(), Configuration.canvasHeight());
		ctx.closePath();

		for (const entity of this.entityTable.entities) {
			ctx.fillStyle = entity.color;
			ctx.beginPath();
			ctx.fillRect(entity.x, entity.y, entity.size, entity.size);
			ctx.closePath();
		}
	}

	update() {
		this.entityTable.update();

		this.continue = !Game.isGameOver(this.entityTable);
	}

	stopRender() {
		clearInterval(this.game);
	}
}

class Scene {
	constructor(canvas) {
		if (!Validate.isCanvas(canvas)) { throw new Error('canvas is not an instance of canvas: ' + canvas); }

		this.canvas = canvas;
		this.canvas.setAttribute('width', Configuration.canvasWidth());
		this.canvas.setAttribute('height', Configuration.canvasHeight());
	}

	setStage(stage) {
		this.stage = stage;
	}
}

// "Main" method

window.onload = function() {
	const scene = new Scene(document.getElementById('canvas'));
	scene.setStage(new DynamicStage(scene.canvas.getContext('2d')));
	WriteScreen.writeAlltime(score);
}
