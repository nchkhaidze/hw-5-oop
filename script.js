/* I made a simple GUI for extra convenience.
    When the calculate price button is pressed the processOrder function is executed.
    At the end of the script, testing is executed using all the methods of Order class. */

var form = document.querySelector('form');
form.addEventListener('submit', processOrder);

// Constants

var itemsSet = {
    smallHamburgerCheese: new Hamburger('small', new FoodItem('cheese', 10, 20)),
    smallHamburgerSalad: new Hamburger('small', new FoodItem('salad', 20, 5)),
    smallHamburgerPotato: new Hamburger('small', new FoodItem('potato', 15, 10)),

    largeHamburgerCheese: new Hamburger('large', new FoodItem('cheese', 10, 20)),
    largeHamburgerSalad: new Hamburger('large', new FoodItem('salad', 20, 5)),
    largeHamburgerPotato: new Hamburger('large', new FoodItem('potato', 15, 10)),

    cola: new FoodItem('cola', 50, 40),
    coffee: new FoodItem('coffee', 80, 20),

    cesarSalad: new FoodItem('cesar salad', 100, 20),
    olivierSalad: new FoodItem('olivier salad', 50, 80),
}

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
}

// Order Class

function Order() {
    this.items = Array.prototype.slice.call(arguments);
    this.paid = false;
    this.editable = true;
}

Order.prototype.showItems = function () {
    console.log('Your order is:')
    for (var i = 0; i < this.items.length; i++) {
        console.log(this.items[i].name);
    }
};

Order.prototype.addItem = function (item) {
    if (this.editable) {
        this.items.push(item);
    }
};

Order.prototype.removeItem = function (name) {
    if (this.editable) {
        this.items = this.items.filter(function (item) {
            return item.name !== name;
        });
    }
};

Order.prototype.getPrice = function () {
    return this.items.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue.price;
    }, 0) + '$';
};

Order.prototype.getCalories = function () {
    return this.items.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue.calories;
    }, 0) + ' calories';
};

Order.prototype.pay = function () {
    this.paid = true;
    this.editable = false;
};

// Food Item - general class for food items

function FoodItem(name, price, calories) {
    this.name = name;
    this.price = price;
    this.calories = calories;
}

// Hamburger class extends FoodItem, accepts FoodItem object as stuffing argument

function Hamburger(size, stuffing) {
    this.size = size;
    this.stuffing = stuffing;
    if (this.size == 'large') {
        FoodItem.call(this, 'Large Hamburger with ' + this.stuffing.name, 100 + this.stuffing.price, 40 + this.stuffing.calories);
    } else {
        FoodItem.call(this, 'Small Hamburger with ' + this.stuffing.name, 50 + this.stuffing.price, 20 + this.stuffing.calories)
    }
}

Hamburger.__proto__ = FoodItem;
Hamburger.prototype.__proto__ = FoodItem.prototype;

// Testing

var order = new Order();
order.addItem(itemsSet.largeHamburgerSalad);
order.addItem(itemsSet.smallHamburgerPotato);
order.addItem(itemsSet.coffee);
order.addItem(itemsSet.olivierSalad);
order.pay();
order.removeItem(itemsSet.coffee);
order.addItem(itemsSet.cesarSalad);

order.showItems();
console.log(order.getPrice(), order.getCalories());
