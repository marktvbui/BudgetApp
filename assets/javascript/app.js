// Budget Controller
var budgetController = (function() {


})();

// UI Controller
var UIController = (function() {

    // setting object with all the input class names, in case ui classes gets changed
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
    }

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

    // setting Dom to access getDomstrings method
    var Dom = UICtrl.getDomstrings();

    var ctrlAddItem = function() {

        // get filled input data
        var input = UICtrl.getinput();
        console.log(input);
        // add item to the budget controller
        // add the item to the UI interface
        // calculate the budget
        // display budget

    }

    // onclick event to happen when a user clicks on the add_btn, calling the crtlAddItem function
    document.querySelector(Dom.inputBtn).addEventListener('click', ctrlAddItem);

    // global 'return/enter' button press event listener
    document.addEventListener('keypress', function(event) {

        if (event.keycode === 13 || event.which === 13) {
            ctrlAddItem();
        }

    });

})(budgetController, UIController);