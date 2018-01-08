// Budget Controller
var budgetController = (function() {

    // function constructor storing expenses
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // function constructor storing income
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // setting data object for storing user input for exp/inc
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0,
        }
    };

    return {
        addItem: function(type, des, val) {
            var newItem;

            if (data.allItems[type].length > 0) {
            // creating new id from last id
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else {
                ID = 0;
            }

            // creating new item based on type exp/inc
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // pushing newItem into their proper array
            data.allItems(type).push(newItem);

            // returning new item
            return newItem;
        }
    };

})();



// UI Controller
var UIController = (function() {

    // setting object with all the input class names, in case ui classes gets changed
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
    };

    return {
        getinput: function() {
            // returning an object with input from the UI
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            }

        }

        // setting public method to allow other controllers to access DOMstrings
        getDomstrings: function() {
            return DOMstrings;
        }
    };

})();



// Main App Controller
var controller = (function(budgetCtrl, UICtrl) {

    // setting up
    var setupEventListeners = function() {
        // setting Dom to access getDomstrings method
        var Dom = UICtrl.getDomstrings();
        // onclick event to happen when a user clicks on the add_btn, calling the crtlAddItem function
        document.querySelector(Dom.inputBtn).addEventListener('click', ctrlAddItem);

        // global 'return/enter' button press event listener
        document.addEventListener('keypress', function(event) {
            if (event.keycode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function() {
        var input, newItem;
        // get filled input data

        input = UICtrl.getinput();
        console.log(input);
        // add item to the budget controller

        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // add the item to the UI interface
        // calculate the budget
        // display budget

    };

    return {
        // function that runs when app starts
        init: function() {
            setupEventListeners();
        }
    };

})(budgetController, UIController);


// calling init method from controller
controller.init();