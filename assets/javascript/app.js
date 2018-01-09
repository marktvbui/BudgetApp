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
            var newItem, ID;

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
            data.allItems[type].push(newItem);

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
        incomeContainer: '.income__list',
        expensesContainer: '.expense__list',
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text within the if statements
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });

            fieldsArr[0].focus();

        },
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
        input = UICtrl.getInput();

        // add item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // add the item to the UI interface
        UICtrl.addListItem(newItem, input.type);

        // clear the fields
        UICtrl.clearFields();

        // calculate the budget
        // display budget

    };

    return {
        // function that runs when app starts
        init: function() {
            setupEventListeners();
            console.log('app has started');
        }
    };

})(budgetController, UIController);


// calling init method from controller
controller.init();