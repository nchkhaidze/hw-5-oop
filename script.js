/* I made a simple GUI for extra convenience.
    When the calculate price button is pressed the processOrder function is executed.
    At the end of the script, testing is executed using all the methods of Order class. */

var form = document.querySelector('form');
form.addEventListener('submit', processOrder);

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
        if (this.items[i] instanceof Salad) {
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
    if (item instanceof Salad) {
        var itemIndex = this.items.indexOf(item);

        if (itemIndex !== -1) {
            this.items[itemIndex].weight += 100;
            return;
        }
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

function FoodItem(name, price, calories) {
    this.name = name;
    this.price = price;
    this.calories = calories;
}

FoodItem.prototype.getPrice = function () {
    return this.price;
}

FoodItem.prototype.getCalories = function () {
    return this.calories;
}

// Drink class extends FoodItem

function Drink(name, price, calories) {
    FoodItem.apply(this, arguments);
}

Drink.__proto__ = FoodItem;
Drink.prototype.__proto__ = FoodItem.prototype;

// Salad class extends FoodItem

function Salad(name, price, calories) {
    FoodItem.apply(this, arguments);
    this.weight = 100;
}

// Make prototype assignment through __proto__ and not Object.create() so as not to break instanceof check
Salad.__proto__ = FoodItem;
Salad.prototype.__proto__ = FoodItem.prototype;

Salad.prototype.getPrice = function () {
    return (this.weight / 100 * this.price);
}

Salad.prototype.getCalories = function () {
    return (this.weight / 100 * this.calories);
}

// Stuffing class extends FoodItem

function Stuffing(name, price, calories) {
    FoodItem.apply(this, arguments);
}

Stuffing.__proto__ = FoodItem;
Stuffing.prototype.__proto__ = FoodItem.prototype;

// Hamburger class extends FoodItem, accepts FoodItem object as stuffing argument

function Hamburger(size, stuffing) {
    this.size = size;
    this.stuffing = stuffing;
    if (this.size == 'large') {
        FoodItem.call(this, 'Large Hamburger with ' + this.stuffing.name, 100, 40);
    } else {
        FoodItem.call(this, 'Small Hamburger with ' + this.stuffing.name, 50, 20)
    }
}

Hamburger.__proto__ = FoodItem;
Hamburger.prototype.__proto__ = FoodItem.prototype;

Hamburger.prototype.getPrice = function () {
    return this.price + this.stuffing.price;
}

Hamburger.prototype.getCalories = function () {
    return this.calories + this.stuffing.calories;
}

// Testing

var order = new Order();

order.addItem(itemsSet.largeHamburgerSalad);
order.addItem(itemsSet.smallHamburgerPotato);
order.addItem(itemsSet.coffee);
order.addItem(itemsSet.olivierSalad);
order.addItem(itemsSet.olivierSalad);
order.addItem(itemsSet.olivierSalad);
order.pay();
order.removeItem(itemsSet.coffee);
order.removeItem(itemsSet.olivierSalad);


console.log(order.items);
order.showItems();
console.log(order.getPrice(), order.getCalories());
