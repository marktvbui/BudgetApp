// Budget Controller
var budgetController = (function() {

    // function constructor storing expenses
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    // calculates expense calculator
    Expense.prototype.calcPercentage = function(totalIncome) {

        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    // returns expense percentage
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    // function constructor storing income
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // function calculating total of either expense or income
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    // setting data object for storing user input for exp/inc
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    // public methods
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
        },

        deleteItem: function(type, id) {
            var ids, index;

            // creating a new array with map method
            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            // finding location of id inside the array, and setting index to actual ids
            index = ids.indexOf(id);

            // if index is found we splice it out of the array
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function() {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            // looping through each expense and calculates percentages
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        // setting object to input data
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            };
        },
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
    };
    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;

        // overriding num to take absolute value
        num = Math.abs(num);

        // formating num to have 2 decimals
        num = num.toFixed(2);

        // divides num into int and decimals
        numSplit = num.split('.');

        // setting int to number part of num
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        // setting dec to the decimals
        dec = numSplit[1];

        // shorthand statement, returning type (-/+) along with int + dec
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    // public function allowing access the input fields
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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {

            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);

        },

        // method to clear the input fields
        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // fields from above is a string, however using prototype.slice.call tricks app to thinking it's an array
            fieldsArr = Array.prototype.slice.call(fields);

            // forEach loop, going through each element inside fieldsArr, and clearing them
            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });

            fieldsArr[0].focus();

        },

        // method to display budget info to DOM
        displayBudget: function(obj) {
            var type;
            obj.budget >= 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            // if else statement, if percentage is greater than 0, will show %, otherwise shows ---
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';

            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';

            }
        },

        // method to display percentags of expenses to html
        displayPercentages: function(percentages) {

            // grabbing all expense elements and saving them into fields variable
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            // creating a function that accepts a list, and callback function
            var nodeListForEach = function(list, callback) {
                // looping through each expense, and setting value and index
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                };
            };

            // calling nodelist function and sending percentages to DOM
            nodeListForEach(fields, function(current, index){

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                };
            });

        },

        displayMonth: function() {
            var now, year, month, months;
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November',  'December'];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

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
        // setting DOM to access getDomstrings method
        var DOM = UICtrl.getDomstrings();

        // onclick event to happen when a user clicks on the add_btn, calling the crtlAddItem function
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // global 'return/enter' button press event listener
        document.addEventListener('keypress', function(event) {
            if (event.keycode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        // setting up an event delegation, potential many items needing event listener, and dynamic items created
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() {

        // calculate the budget
        budgetCtrl.calculateBudget();

        // return budget
        var budget = budgetCtrl.getBudget();

        // display budget
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

        // calculate percentages
        budgetCtrl.calculatePercentages();

        // Read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();

        // update DOM
        UICtrl.displayPercentages(percentages);

    };

    // function to add items to object
    var ctrlAddItem = function() {
        var input, newItem;
        // get filled input data
        input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // add the item to the UI interface
            UICtrl.addListItem(newItem, input.type);

            // clear the fields
            UICtrl.clearFields();

            // calculate and update budget
            updateBudget();

            // calculate and update percentages
            updatePercentages();
        }

    };

    // function to delete items from UI and data Object
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // delete item from data structure
            budgetCtrl.deleteItem(type, ID);

            // delete item from UI
            UICtrl.deleteListItem(itemID);

            // update and show new budget
            updateBudget();

            // calculate and update percentages
            updatePercentages();

        }

    };

    return {
        // function that runs when app starts
        init: function() {
            console.log('app has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);


// calling init method from controller
controller.init();