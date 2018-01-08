// Budget Controller
var budgetController = (function() {


})();

// UI Controller
var UIController = (function() {

    return {
        getinput: function() {
            // returning an object with all the UI
            return {
                type: document.querySelector('.add__type').value,
                description: document.querySelector('.add__description').value,
                value: document.querySelector('.add__value').value,
            }

        }
    };

})();

// Main App Controller
var controller = (function(budgetCtrl, UICtrl) {

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
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    // global 'return/enter' button press event listener
    document.addEventListener('keypress', function(event) {

        if (event.keycode === 13 || event.which === 13) {
            ctrlAddItem();
        }

    });

})(budgetController, UIController);