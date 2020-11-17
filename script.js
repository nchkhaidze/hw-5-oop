/* I made a simple GUI for extra convenience.
    When the calculate price button is pressed the processOrder function is executed. */

var form = document.querySelector('form');
form.addEventListener('submit', processOrder);

function processOrder(event) {
    // Prevent the form from refreshing on submit

    event.preventDefault();

    // Parsing user input from input fields

    var formData = Array.prototype.slice.call(document.querySelectorAll('input')).map(function (input) {
        if (input.value !== '0') {
            var entry = {};
            entry.name = input.name;
            entry.quantity = +input.value;
            return entry;
        }
        return null;
    }).filter(function (entry) {
        return entry !== null;
    });

    var order = new Order();

    formData.forEach(function (item) {
        for (var i = 0; i < item.quantity; i++) {
            order.addItem(itemsSet[item.name]);
        }
    });

    console.log(order);
    order.showItems();

    // Outputting the result

    var outputField = document.querySelector('.output-field');
    outputField.textContent = order.getPrice() + ' ' + order.getCalories();

    Array.prototype.slice.call(document.querySelectorAll('input')).forEach(function (input) {
        input.value = '';
    });
}

// Order Class
function Order() {
    this.items = Array.prototype.slice.call(arguments);
    this.paid = false;
}

Order.prototype.showItems = function () {
    console.log('Your order is:')
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].getType() === 'salad') {
            console.log(this.items[i].weight + ' grams of ' + this.items[i].name);
            break;
        }
        console.log(this.items[i].name);
    }
};

Order.prototype.addItem = function (item) {
    if (Object.isFrozen(this.items)) {
        return;
    }
    // If item is a salad, stack it by weight instead of adding one more
    if (item.getType() === 'salad') {
        var itemIndex = this.items.indexOf(item);

        if (itemIndex === -1) {
            item.setWeight(100)
            this.items.push(item);
        } else {
            this.items[itemIndex].setWeight(this.items[itemIndex].weight + 100);
        }
        return;
    }
    this.items.push(item);
};

Order.prototype.removeItem = function (item) {
    if (!Object.isFrozen(this.items)) {
        this.items = this.items.filter(function (i) {
            return i.name !== item.name;
        });
    }
};

Order.prototype.getPrice = function () {
    return this.items.reduce(function (a, b) {
        return a + b.getPrice();
    }, 0) + ' $';
};

Order.prototype.getCalories = function () {
    return this.items.reduce(function (a, b) {
        return a + b.getCalories();
    }, 0) + ' calories';
};

Order.prototype.pay = function () {
    this.items = Object.freeze(this.items);
    this.paid = true;
};

// Food Item - general class for food items
function FoodItem(name, price, calories, type) {
    this.name = name;
    this.price = price;
    this.calories = calories;
    this.type = type;
}

FoodItem.prototype.getPrice = function () {
    return this.price;
}

FoodItem.prototype.getCalories = function () {
    return this.calories;
}

FoodItem.prototype.getType = function() {
    return this.type;
}

// Drink class extends FoodItem
function Drink(name, price, calories) {
    FoodItem.apply(this, arguments);
    this.type = 'drink';
}

Drink.prototype = Object.create(FoodItem.prototype);
Drink.prototype.constructor = Drink;

// Salad class extends FoodItem
function Salad(name, price, calories) {
    FoodItem.apply(this, arguments);
    this.type = 'salad';
    this.weight = 100;
}

Salad.prototype = Object.create(FoodItem.prototype);
Salad.prototype.constructor = Salad;

Salad.prototype.getPrice = function () {
    return (this.weight / 100 * this.price);
}

Salad.prototype.getCalories = function () {
    return (this.weight / 100 * this.calories);
}

Salad.prototype.setWeight = function(weight) {
    this.weight = weight;
}

// Stuffing class extends FoodItem
function Stuffing(name, price, calories) {
    FoodItem.apply(this, arguments);
    this.type = 'stuffing';
}

Stuffing.prototype = Object.create(FoodItem.prototype);
Stuffing.prototype.constructor = Stuffing;

// Hamburger class extends FoodItem, accepts FoodItem object as stuffing argument
function Hamburger(size, stuffing) {
    this.size = size;
    this.stuffing = stuffing;
    if (this.size == 'large') {
        FoodItem.call(this, 'Large Hamburger with ' + this.stuffing.name, 100, 40, 'hamburger');
    } else {
        FoodItem.call(this, 'Small Hamburger with ' + this.stuffing.name, 50, 20, 'hamburger');
    }
}

Hamburger.prototype = Object.create(FoodItem.prototype);
Hamburger.prototype.constructor = Hamburger;

Hamburger.prototype.getPrice = function () {
    return this.price + this.stuffing.price;
}

Hamburger.prototype.getCalories = function () {
    return this.calories + this.stuffing.calories;
}

// Constants
var itemsSet = {
    smallHamburgerCheese: new Hamburger('small', new Stuffing('cheese', 10, 20)),
    smallHamburgerSalad: new Hamburger('small', new Stuffing('salad', 20, 5)),
    smallHamburgerPotato: new Hamburger('small', new Stuffing('potato', 15, 10)),

    largeHamburgerCheese: new Hamburger('large', new Stuffing('cheese', 10, 20)),
    largeHamburgerSalad: new Hamburger('large', new Stuffing('salad', 20, 5)),
    largeHamburgerPotato: new Hamburger('large', new Stuffing('potato', 15, 10)),

    cola: new Drink('cola', 50, 40),
    coffee: new Drink('coffee', 80, 20),

    cesarSalad: new Salad('cesar salad', 100, 20),
    olivierSalad: new Salad('olivier salad', 50, 80),
};

