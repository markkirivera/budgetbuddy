// Budget Buddy
var budgetController = (function() {

    var itemsObject;

    // Function constructors
    var Expense = function(id, category, description, value, date) {
        this.id = id;
        this.category = category;
        this.description = description;
        this.value = value;
        this.percentage = 0;
        this.date = date;
    };

    var Income = function(id, category, description, value, date) {
        this.id = id;
        this.category = category;
        this.description = description;
        this.value = value;
        this.date = date;
    };

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
        percentage: 0
    };

    var data2 = {
        id: 1,
        date: 0,
        data: {
            allItems: {
                exp: [],
                inc: []
            },
            totals: {
                exp: 0,
                inc: 0
            },
            budget: 0,
            percentage: 0
        }
    };

    return {

        testing: function() {
            console.log('testing');
        },

        returnData: function() {
            return data;
        },

        getCurrentDate: function() {
            var curr = moment().format('YYYY-MM-DD');
            return curr;
        },

        // Get date/s based on filter type
        setFilterType: function(range) {

            var type, response;

            if (range == 'Today') {

                var curr = moment().format('YYYY-MM-DD');
                response = curr;
                type = 'single';

                return makeObj(type, false, response);

            } else if (range == 'Yesterday') {

                var yesterday = moment().add(-1, 'days').format('YYYY-MM-DD');
                response = yesterday;
                type = 'single';

                return makeObj(type, false, response);

            } else if (range == 'This Week') {

                var firstday = moment().startOf('week').format('YYYY-MM-DD');
                var lastday = moment().endOf('week').format('YYYY-MM-DD');

                response = [];
                response.push(firstday);
                response.push(lastday);
                type = 'duo';

                return makeObj(type, true, response);

            } else if (range == 'Last Week') {

                var lastMonday = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
                var lastSunday = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');

                response = [];
                response.push(lastMonday);
                response.push(lastSunday);
                type = 'duo';

                return makeObj(type, true, response);

            } else if (range == 'This Month') {

                var startDate = moment().startOf('month').format("YYYY-MM-DD");
                var endDate = moment().endOf("month").format("YYYY-MM-DD");

                response = [];
                response.push(startDate);
                response.push(endDate);
                type = 'duo';

                return makeObj(type, true, response);

            } else if (range == 'Last Month') {

                var startDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
                var endDate = moment().subtract(1, 'month').endOf("month").format("YYYY-MM-DD");

                response = [];
                response.push(startDate);
                response.push(endDate);
                type = 'duo';

                return makeObj(type, true, response);

            }

            function makeObj(type, isArray, resp) {
                // Define desired object
                var obj = {
                    type: type,
                    isArray: isArray,
                    resp: resp
                };
                // Return it
                return obj;
            }

        },

        // Filter data object based on filter type
        filterData: function() {

            var data = [
                { id: 1, category: "Home", description: "Rent", value: 4000, percentage: 15, date: "2020-09-03" },
                { id: 4, category: "Bills", description: "2123123", value: 233, percentage: 1, date: "2020-09-04" },
                { id: 6, category: "Clothing", description: "Jeans", value: 112, percentage: 0, date: "2020-09-05" },
                { id: 9, category: "Hobbies", description: "Shirt", value: 432, percentage: 2, date: "2020-09-06" }
            ];

            ed = new Date("2020-09-06").getTime();
            sd = new Date("2020-09-05").getTime();

            result = data.filter(d => {
                var time = new Date(d.date).getTime();
                return (sd <= time && time <= ed);
            });

            console.log(result);
            return result;

        },

        // Filter Data by month
        filterByMonth: function() {

            var currentMonth = new Date().getMonth() + 1;
            var currentYear = new Date().getFullYear();

            var filteredInc = data.allItems.inc.filter(d => {
                var [year, month] = d.date.split('-'); // Or, var month = e.date.split('-')[1];
                return (currentMonth === +month) && (currentYear == year);
            });

            var filteredExp = data.allItems.exp.filter(d => {
                var [year, month] = d.date.split('-'); // Or, var month = e.date.split('-')[1];
                return (currentMonth === +month) && (currentYear == year);
            });

            var filteredData = {
                inc: filteredInc,
                exp: filteredExp
            }

            return filteredData;

        },

        returnIncome: function() {
            // Create new object for every income
            var income = function(categ, val) {
                this.category = categ;
                this.value = val;
            };

            var incomeObj = [];

            // Return only category and value
            data.allItems.inc.forEach(function(curr) {
                newItem = new income(curr.category, curr.value);
                incomeObj.push(newItem);
            });

            return incomeObj;

        },

        returnExpenses: function() {
            // Create new object for every income
            var expense = function(categ, val) {
                this.category = categ;
                this.value = val;
            };

            var expenseObj = [];

            // Return only category and value
            data.allItems.exp.forEach(function(curr) {
                newItem = new expense(curr.category, curr.value);
                expenseObj.push(newItem);
            });

            return expenseObj;
        },

        setLocalStorage: function() {
            if (localStorage.getItem('items')) {
                itemsObject = JSON.parse(localStorage.getItem('items'));
                data = itemsObject;
                localStorage.setItem('items', JSON.stringify(itemsObject));
            } else {
                itemsObject = data;
                localStorage.setItem('items', JSON.stringify(itemsObject));
            }
        },

        updateLocalStorage: function() {
            localStorage.setItem('items', JSON.stringify(data));
            itemsObject = JSON.parse(localStorage.getItem('items'));
        },

        addItem: function(type, categ, desc, val, date) {
            // Generate id
            if (data.allItems[type].length > 0) {
                id = data.allItems[type].length + 1;
            } else {
                id = 1;
            }

            if (type === 'exp') {
                newItem = new Expense(id, categ, desc, val, date);
                data.allItems.exp.push(newItem);
            } else if (type === 'inc') {
                newItem = new Income(id, categ, desc, val, date);
                data.allItems.inc.push(newItem);
            }

            return {
                newItem: {
                    id: id,
                    type: type,
                    categ: categ,
                    desc: desc,
                    val: val
                }
            }
        },

        deleteItem: function(type, id) {
            if (type == 'exp') {
                index = data.allItems.exp.findIndex(x => x.id === id);
                data.allItems.exp.splice(index, 1);
            } else if (type == 'inc') {
                index = data.allItems.inc.findIndex(x => x.id === id);
                data.allItems.inc.splice(index, 1);
            }

            return data;
        },

        calcExpensesPercentage: function(newData) {

            // Calculate percentage per expenses
            // if (newData.allItems.exp.length > 0 && newData.totals.inc > newData.totals.exp) {
            if (newData.allItems.exp.length > 0 && newData.totals.inc != 0) {

                data.allItems.exp.forEach(function(index) {
                    var exp = Math.round((index.value / data.totals.inc) * 100);

                    index.percentage = parseInt(exp);
                });

            } else {
                data.allItems.exp.forEach(function(index) {
                    index.percentage = 0;
                });
            }

        },

        calcTotal: function() {
            var totalInc = 0,
                totalExp = 0,
                totalPerc = 0;

            // Calculate total income
            data.allItems.inc.forEach(function(curr) {
                totalInc = curr.value + totalInc;
            });

            // Calculate total expenses
            data.allItems.exp.forEach(function(curr) {
                totalExp = curr.value + totalExp;
            });

            // Calculate total expense percentage
            // data.allItems.exp.forEach(function(curr) {
            //     // totalPerc = curr.percentage + totalPerc;
            //     console.log(curr.percentage);
            // });

            // totalPerc = (totalExp / totalInc) * 100;
            // totalPerc = (totalPerc).toFixed(0);

            // Prevent negative percent
            // if (totalPerc > 0) {
            //     totalPerc = totalPerc;
            // } else {
            //     totalPerc = 0;
            // }

            data.totals.inc = totalInc;
            data.totals.exp = totalExp;
            data.budget = totalInc - totalExp;

            if (data.totals.inc != 0) {
                totalPerc = parseInt((data.totals.exp / data.totals.inc) * 100);
                data.percentage = Math.trunc(totalPerc);
            } else {
                data.percentage = 0;
            }

            return data;
        }
    }
})();


var UIController = (function() {

    var DOMstrings = {
        remainingText: '.budget__value',
        incomeTarget: '.budget__income',
        incomeText: '.budget__income--value',
        expenseText: '.budget__expenses--value',
        floatBtnDiv: '.fixed-action-btn',
        floatBtn: '.btn-floating',
        popIncomeText: '.popup__income--value',
        popExpenseText: '.popup__expenses--value',
        expensePercentage: '.budget__expenses--percentage',
        inputType: '.add__type',
        inputCateg: '.add__categ',
        inputDesc: '.add__description',
        inputDate: '.add__date',
        inputVal: '.add__value',
        inputBtn: '.add__btn',
        listCont: '.list-container',
        deleteBtn: '.item__delete--btn',
        incCont: '.income__list',
        expCont: '.expenses__list',
        dateLabel: '.budget__title--month',
        item: 'item',
        incTitle: '.recs-tab .income__title',
        expTitle: '.recs-tab .expenses__title',
        myChart1: 'myChart1',
        myChart1: 'myChart1',
        myChart2: 'myChart2',
        incomePie: '.chart-container .income',
        expensePie: '.chart-container .expenses',
        exp: '.exp',
        inc: '.inc',
        addContainer: '.add-main-container',
        addPopupCont: '.add-popup-container',
        popupModal: '.modal',
        addBtn: '.add-btn',
        tabTitle: '.tab-title-container a',
        activeTabTitle: '.tab-title-container a.active',
        recTab: '.recs-tab',
        chartsTab: '.charts-tab',

        //Popup Modal
        popupContainer: '.popup-budget-container',
        scrollDiv: '#scrollDiv',

        warning: '.warning',

        recTypeIncome: '.popup__income',
        recType: '.rec-type',
        categType: '.categ-type',
        recCateg: '.categ-type li',
        incCateg: '.categ-type .inc',
        expCateg: '.categ-type .exp',

        incActiveList: '.categ-type .inc',
        expActiveList: '.categ-type .exp',

        activeRec: '.rec-type.active',
        activeCateg: '.categ-type li.active',

        regDesc: '.desc-container .add__description',
        regDate: '.date-container .add__date',
        regVal: '.val-container .add__value',

        cancelBtn: '.cancel-btn',
        saveBtn: '.save-btn',

        expandBtn: '.expand-btn',

        // Filter Modal
        filterType: '.filter-type',
        filter: '.filter',
        filterActive: '.filter.active',
        datePicker: '.datepicker',
        dateFrom: '.modal-date__from',
        dateTo: '.modal-date__to',
        filterFlexCont: '#modal2 .flex-container',
        filterBtn: '.filter-btn',
    }

    // Add sign and decimal places to budget
    var formatBudget = function(obj) {

        var numSplit, int, dec, sign;

        if (obj.totals.inc > obj.totals.exp) {
            sign = '+'
        } else if (obj.totals.exp <= obj.totals.inc) {
            sign = ''
        } else {
            sign = '-'
        }

        /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands

        2310.4567 -> + 2,310.46
        2000 -> + 2,000.00
        */

        num = Math.abs(obj.budget);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return sign + int + '.' + dec;
    }

    // Add sign and decimal places to numbers
    var formatNumber = function(num, type) {

        var numSplit, int, dec, sign;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    // Function to do something to a node list
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    // Circle budget progress bar
    var setBudgetProg = function(percentage) {
        var bar1 = new ldBar("#ldBar");
        bar1.set(percentage);
    };

    return {
        getDOMstrings: function() {
            return DOMstrings;
        },

        clearList: function() {
            var paras = document.getElementsByClassName(DOMstrings.item);
            while (paras[0]) {
                paras[0].parentNode.removeChild(paras[0]);
            }
        },

        // Show add div for user input
        showAddDiv: function() {
            document.querySelector(DOMstrings.addContainer).classList.toggle('show');
            // document.querySelector(DOMstrings.addPopupCont).classList.toggle('show');
        },

        // Add expense or income to UI
        addListItem: function(obj, type) {

            var html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incCont;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__category">%category%</div><div class="item__date">%date%</div><div class="item__description">%description%</div><div class="amount__cont"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expCont;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__category">%category%</div><div class="item__date">%date%</div><div class="item__description">%description%</div><div class="amount__cont"><div class="item__value">%value%</div><div class="item__percentage">%percentage%%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // Replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%date%', obj.date);
            newHtml = newHtml.replace('%category%', obj.category);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            if (type === 'exp') {
                newHtml = newHtml.replace('%percentage%', obj.percentage);
            }

            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            // console.log(obj.date);

        },

        updateRest: function(dataObj) {
            // format numbers
            var budget, income, expenses;
            budget = formatBudget(dataObj, 'inc');
            income = formatNumber(dataObj.totals.inc, 'inc');
            expenses = formatNumber(dataObj.totals.exp, 'exp');

            // Remaining Budget
            document.querySelector(DOMstrings.remainingText).textContent = budget;
            document.querySelector(DOMstrings.incomeText).textContent = income;
            document.querySelector(DOMstrings.expenseText).textContent = expenses;
            document.querySelector(DOMstrings.popIncomeText).textContent = income;
            document.querySelector(DOMstrings.popExpenseText).textContent = expenses;

            if (dataObj.percentage != null && dataObj.percentage != Infinity) {
                setBudgetProg(dataObj.percentage);
            } else {
                setBudgetProg(0);
            }

        },

        // Add border color to input, select boxes and add button 
        changedType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputCateg + ',' +
                DOMstrings.inputDesc + ',' +
                DOMstrings.inputVal
            );

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            var typeVal = document.querySelector(DOMstrings.inputType).value;
            var exp = document.querySelectorAll(DOMstrings.exp);
            var inc = document.querySelectorAll(DOMstrings.inc);

            var val = 'sel';

            if (typeVal == 'exp') {

                // Select default option
                document.querySelector('.add__categ [value="' + val + '"]').selected = true;

                // hide income
                nodeListForEach(inc, function(cur) {
                    cur.classList.add('hide');
                });

                // show expenses
                nodeListForEach(exp, function(cur) {
                    cur.classList.remove('hide');
                });

            } else if (typeVal == 'inc') {

                // Select default option
                document.querySelector('.add__categ [value="' + val + '"]').selected = true;

                // hide expenses
                nodeListForEach(exp, function(cur) {
                    cur.classList.add('hide');
                });

                // show income
                nodeListForEach(inc, function(cur) {
                    cur.classList.remove('hide');
                });
            }
        },

        displayMonth: function() {

            var now, month, months, year;

            now = new Date();
            months = ['January', 'February', 'March', 'Aprl', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },


        // To Clean -------------------------------------------------------------
        hideElement: function(element) {
            // console.log(document.querySelector(element));
            document.querySelector(element).style.display = 'none';
        },

        showElement: function(element) {
            // console.log(document.querySelector(element));
            document.querySelector(element).style.display = '';
        },

        toggleIncTitle: function(type) {
            if (type == 'hide') {
                document.querySelector(DOMstrings.incTitle).classList.add('hide');
            } else if (type == 'show') {
                document.querySelector(DOMstrings.incTitle).classList.remove('hide');
            }
        },

        toggleExpTitle: function(type) {
            if (type == 'hide') {
                document.querySelector(DOMstrings.expTitle).classList.add('hide');
            } else if (type == 'show') {
                document.querySelector(DOMstrings.expTitle).classList.remove('hide');
            }
        }

        // hideIncomeParag: function() {
        //     document.querySelector(DOMstrings.noRecIncome).classList.add('hide');
        // },

        // hideExpensesParag: function() {
        //     document.querySelector(DOMstrings.noRecExpenses).classList.add('hide');
        // },

        // showIncomeParag: function() {
        //     document.querySelector(DOMstrings.noRecIncome).classList.remove('hide');
        // },

        // showExpensesParag: function() {
        //     document.querySelector(DOMstrings.noRecExpenses).classList.remove('hide');
        // }
        ,
        hideIncomeChart: function() {
            document.querySelector(DOMstrings.incomePie).classList.add('hide');
        },

        showIncomeChart: function() {
            document.querySelector(DOMstrings.incomePie).classList.remove('hide');
        },

        hideExpensesChart: function() {
            document.querySelector(DOMstrings.expensePie).classList.add('hide');
        },

        showExpensesChart: function() {
            document.querySelector(DOMstrings.expensePie).classList.remove('hide');
        },

    }

})();


var mainController = (function(budgetCtrl, uiCtrl) {

    var DOM = uiCtrl.getDOMstrings();

    // Setup event listeners
    var setupEventListeners = function() {

        // Enter key press
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13 && $('#modal1').hasClass('open')) {
                ctrlAddNewItem();
            }
        });

        // Change input type
        // document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changedType);
        document.querySelector(DOM.listCont).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.floatBtn).addEventListener('click', ctrFab);

        // Custom Scrollbar Library
        // $(".modal.bottom-sheet").mCustomScrollbar();

        // Floating Action Button 
        $(document).ready(function() {
            var elems = document.querySelectorAll(DOM.floatBtnDiv);
            var instances = M.FloatingActionButton.init(elems, {});
        });

        var ctrFab = function() {
            console.log('hello');
        }

        // Modal Initialization
        $(document).ready(function() {
            $('.modal').modal({
                onCloseEnd: function() {
                    clearPopupFields();
                }
            });
        });

        // Tabs
        var tabs = document.querySelectorAll(DOM.tabTitle);
        for (var i in tabs) {
            tabs[i].onclick = function(e) {
                ctrlShowTab(e);
            };
        }

        // Popup Modal Functions

        // Filter Modal
        $(document).ready(function() {
            $(DOM.datePicker).datepicker();

            $(DOM.dateFrom).datepicker({
                maxDate: new Date(09 / 12 / 2020)
            });
        });

        $(DOM.filter).click(function(e) {
            $(DOM.filter).removeClass('active');
            e.currentTarget.classList.add('active');
        });

        var ctrlApplyFilter = function(e, value) {

            var filterVal = $(DOM.filterActive).attr("data-value");
            var filterObj = budgetCtrl.setFilterType(filterVal);
            var dateObj = budgetCtrl.returnData();

            console.log(dateObj);
            console.log(filterObj);

        };

        // Filter Button
        document.querySelector(DOM.filterBtn).addEventListener('click', ctrlApplyFilter);

        // Add Modal
        $(DOM.recType).click(function(e) {
            var type = this.attr("data-value");
            selectRecType(e, type);
        });

        $(DOM.recCateg).click(function(e) {
            var categ = this.attr("data-value");
            selectCategType(e, categ);
        });

        document.querySelector(DOM.saveBtn).addEventListener('click', ctrlAddNewItem);
        document.querySelector(DOM.cancelBtn).addEventListener('click', clearPopupFields);
        document.querySelector(DOM.expandBtn).addEventListener('click', ctrlExpandCateg);

    }

    // Select Record Type - income or expense
    var selectRecType = function(e, type) {
        $(DOM.recType).removeClass('active');
        $(DOM.recCateg).removeClass('active');

        e.currentTarget.classList.add('active');

        $(DOM.categType).addClass('short')
        $(DOM.expandBtn).removeClass('hide');

        if (type == 'inc') {
            $(DOM.incCateg).removeClass('hide');
            $(DOM.expCateg).addClass('hide');
        } else {
            $(DOM.incCateg).addClass('hide');
            $(DOM.expCateg).removeClass('hide');
        }
    }

    // Select Record Category
    var selectCategType = function(e, categ) {
        $(DOM.recCateg).removeClass('active');
        e.currentTarget.classList.add('active');

        $(DOM.regDesc)[0].scrollIntoView({ behavior: 'smooth', block: 'start' });

        console.log(categ);
    }

    var ctrlExpandCateg = function() {
        if ($(DOM.categType).hasClass('short')) {
            $(DOM.categType).removeClass('short');
            $(DOM.expandBtn).addClass('hide');
        } else {
            $(DOM.categType).addClass('short')
            $(DOM.expandBtn).removeClass('hide');
        }
    }

    var ctrlAddNewItem = function() {
        // 1. Get input values
        var type = document.querySelector(DOM.activeRec).attr("data-value");
        var categ = document.querySelector(DOM.activeCateg);
        var desc = document.querySelector(DOM.regDesc);
        var date = document.querySelector(DOM.regDate);
        var val = document.querySelector(DOM.regVal);


        // 2. Check if all fields have values
        if (desc.value != '' && val.value != '' && date.value != '' && categ != null) {

            // 3. Pass input values to add to data object
            budgetCtrl.addItem(type, categ.attr("data-value"), desc.value, parseInt(val.value), date.value);

            // 4. Clear all input fields
            clearPopupFields();

            // 5. Remove all list in the UI
            uiCtrl.clearList();

            // 7. Calculate total income, expenses, budget
            var newData = budgetCtrl.calcTotal();

            // 9. Calculate exp percentages
            budgetCtrl.calcExpensesPercentage(newData);

            // 10. Load new list to the UI
            loadList();

            // 11. Update remaining budget UI
            uiCtrl.updateRest(newData);

            // 12. Update Local Storage
            budgetCtrl.updateLocalStorage();

            // Get income for pie chart
            getPieCharts();

            // Close Modal
            $('#modal1').modal('close');

            // Show toast
            $('.toast').remove()
            var toastHTML = '<span class="success-toast">Record successfully added.</span>';
            M.toast({ html: toastHTML, displayLength: 2000 });

        } else {

            // Add warning div
            var popupCont = document.querySelector(DOM.popupContainer);

            var otherWarningDiv = $(DOM.warning);
            if (otherWarningDiv != null) {
                otherWarningDiv.remove();
            }

            var warning = document.createElement('div');
            warning.innerText = 'Please make sure all fields have their values.';
            warning.classList.add('warning');
            warning.id = 'warning';

            popupCont.insertBefore(warning, popupCont.firstChild);

            $(DOM.scrollDiv)[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

    }

    var clearPopupFields = function() {
        var recTypeIncome = $(DOM.recTypeIncome);
        var activeCateg = $(DOM.activeCateg);
        var regDesc = $(DOM.regDesc)[0];
        var regDate = $(DOM.regDate);
        var regVal = $(DOM.regVal)[0];
        var warning = $(DOM.warning);

        $(DOM.scrollDiv)[0].scrollIntoView({ behavior: 'smooth', block: 'start' });

        $(DOM.recType).removeClass('active');
        $(DOM.incCateg).removeClass('hide');
        $(DOM.expCateg).addClass('hide');

        recTypeIncome.addClass('active');
        activeCateg.removeClass('active');

        regDesc.value = "";
        regDate.value = "";
        regVal.value = "";

        warning.remove();

        ctrlExpandCateg();

    }

    var ctrlhideElement = function() {
        uiCtrl.hideElement('.no-record');
    }

    var ctrlAddItem = function() {
        // 1. Get input values
        var type = document.querySelector(DOM.inputType);
        var categ = document.querySelector(DOM.inputCateg);
        var desc = document.querySelector(DOM.inputDesc);
        var val = document.querySelector(DOM.inputVal);
        var date = document.querySelector(DOM.inputDate);

        // 2. Check if all fields have values
        if (desc.value != '' && val.value != '' && categ.value != 'sel') {

            // Get current date
            var currDate = budgetCtrl.getCurrentDate();
            console.log(currDate);

            // 3. Pass input values to add to data object
            budgetCtrl.addItem(type.value, categ.value, desc.value, parseInt(val.value), date.value);

            // 4. Clear all input fields
            desc.value = "";
            val.value = "";

            // 5. Remove all list in the UI
            uiCtrl.clearList();

            // 7. Calculate total income, expenses, budget
            var newData = budgetCtrl.calcTotal();

            // 9. Calculate exp percentages
            budgetCtrl.calcExpensesPercentage(newData);

            // 10. Load new list to the UI
            loadList();

            // 11. Update remaining budget UI
            uiCtrl.updateRest(newData);

            // 12. Update Local Storage
            budgetCtrl.updateLocalStorage();

            // Get income for pie chart
            getPieCharts();

            // alert('successfully added');
        }
    }

    // Load list to the UI
    var loadList = function() {

        var data = budgetCtrl.returnData();

        if (data.allItems.inc.length > 0) {

            // uiCtrl.hideIncomeParag();
            uiCtrl.toggleIncTitle('show');

            // 1. Load income
            data.allItems.inc.forEach(function(curr) {
                uiCtrl.addListItem(curr, 'inc');
            });

            if (data.allItems.inc.length > 9) {
                $(DOM.incCont).addClass('mCustomScrollbar');
            } else {
                $(DOM.incCont).removeClass('mCustomScrollbar');
            }

        } else {
            uiCtrl.toggleIncTitle('hide');
            $(DOM.expCont).removeClass('mCustomScrollbar');
        }

        if (data.allItems.exp.length > 0) {

            // uiCtrl.hideExpensesParag();
            uiCtrl.toggleExpTitle('show');

            // 2. Load expenses
            data.allItems.exp.forEach(function(curr) {
                uiCtrl.addListItem(curr, 'exp');
            });

            if (data.allItems.exp.length > 9) {
                $(DOM.expCont).addClass('mCustomScrollbar');
            } else {
                $(DOM.expCont).removeClass('mCustomScrollbar');
            }
        } else {
            uiCtrl.toggleExpTitle('hide');
            $(DOM.expCont).removeClass('mCustomScrollbar');
        }

    }

    // Merge arrays with the same categories
    var mergeObject = function(obj) {

        var output = [];

        obj.forEach(function(item) {
            var existing = output.filter(function(v, i) {
                return v.category == item.category;
            });
            if (existing.length) {
                var existingIndex = output.indexOf(existing[0]);
                output[existingIndex].value = (output[existingIndex].value + (item.value));
            } else {
                if (typeof item.value == 'string')
                    item.value = [item.value];
                output.push(item);
            }
        });

        return output;
    };

    // Get income object for pie chart
    var getIncome = function() {

        var incomeVal = [];
        var incomeLab = [];

        var income = budgetCtrl.returnIncome();
        var mergeArr = mergeObject(income);

        if (mergeArr.length > 0) {
            mergeArr.forEach(function(curr) {
                incomeVal.push(curr.value);
                incomeLab.push(curr.category);
            });

            uiCtrl.showIncomeChart();
            incomeChart(incomeVal, incomeLab);
        } else {
            uiCtrl.hideIncomeChart();
        }
    }

    // Chart.js function to load chart
    var incomeChart = function(incomeVal, incomeLab) {
        var ctx = document.getElementById(DOM.myChart1);
        data = {
            datasets: [{
                label: '# of Votes',
                data: incomeVal,
                backgroundColor: [
                    '#ffbe76',
                    '#f6e58d',
                    '#ff7979',
                    '#badc58',
                    '#dff9fb',
                    '#f9ca24',
                    '#f0932b',
                    '#30336b',
                    '#22a6b3',
                    '#be2edd',
                    '#4834d4',
                    '#535c68',
                    '#7ed6df',
                    '#686de0',
                    '#eb4d4b'
                ],
                borderWidth: 1
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: incomeLab
        };

        var myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                legend: {
                    display: true,
                    labels: {
                        fontColor: '#28B9B5',
                        fontSize: 14,
                        boxWidth: 50
                    },
                    position: 'right',
                    align: "start"
                },
                aspectRatio: 1
            }
        });

    }

    // Get expenses object for pie chart
    var getExpenses = function() {

        var expensesVal = [];
        var expensesLab = [];

        var expenses = budgetCtrl.returnExpenses();
        var mergeArr = mergeObject(expenses);

        if (mergeArr.length > 0) {
            mergeArr.forEach(function(curr) {
                expensesVal.push(curr.value);
                expensesLab.push(curr.category);
            });

            // uiCtrl.showElement();
            uiCtrl.showExpensesChart();
            expensesChart(expensesVal, expensesLab);
        } else {
            uiCtrl.hideExpensesChart();
            // uiCtrl.hideExpensesChart();
        }
    }

    // Chart.js function to load chart
    var expensesChart = function(expensesVal, expensesLab) {

        var ctx = document.getElementById(DOM.myChart2);
        data = {
            datasets: [{
                label: '# of Votes',
                data: expensesVal,
                backgroundColor: [
                    '#4834d4',
                    '#be2edd',
                    '#ff7979',
                    '#f0932b',
                    '#ffbe76',
                    '#686de0',
                    '#dff9fb',
                    '#535c68',
                    '#badc58',
                    '#30336b',
                    '#22a6b3',
                    '#7ed6df',
                    '#f9ca24',
                    '#f6e58d',
                    '#eb4d4b',
                    '#82589F',
                    '#BDC581',
                    '#FC427B',
                    '#182C61',
                    '#6D214F',
                    '#D6A2E8',
                    '#9AECDB',
                    '#FD7272',
                    '#FEA47F',
                    '#25CCF7',
                    '#EAB543',
                    '#55E6C1',
                    '#F8EFBA',
                    '#F97F51'
                ],
                borderWidth: 1
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: expensesLab
        };

        var myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                legend: {
                    display: true,
                    labels: {
                        fontColor: '#ff6384',
                        fontSize: 14,
                        boxWidth: 50
                    },
                    position: 'right',
                    align: "start"
                },
                aspectRatio: 1
            }
        });

    }

    var getPieCharts = function() {
        getIncome();
        getExpenses();
    }

    var ctrlDeleteItem = function(event) {

        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            console.log(itemID);

            // 1. Split item ID into arrays eg. inc-1 to 'inc' and 1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 2. Remove item based on type and ID
            var newData = budgetCtrl.deleteItem(type, ID);

            // // 4. Calculate total income, expenses, budget
            var newData = budgetCtrl.calcTotal();

            // 3. Calculate exp percentages
            budgetCtrl.calcExpensesPercentage(newData);

            // // 5. Remove all list in the UI
            uiCtrl.clearList();

            // // 6. Load new list to the UI
            loadList();

            // // 7. Update remaining budget UI
            uiCtrl.updateRest(newData);

            // // 8. Update Local Storage
            budgetCtrl.updateLocalStorage();

            // Get income for pie chart
            getPieCharts();

            // Show toast
            $('.toast').remove()
            var toastHTML = '<span class="delete-toast">Record successfully deleted.</span>';
            M.toast({ html: toastHTML, displayLength: 2000 });
        }

    }

    var ctrlShowAddDiv = function() {
        uiCtrl.showAddDiv();
        console.log('add button pressed');
    };

    // Switch Tabs
    var ctrlShowTab = function(e) {
        var attr = e.target.dataset.attr;

        // Switch active tab title 
        document.querySelector(DOM.activeTabTitle).classList.remove('active');
        e.target.classList.add('active');

        // Switch main active tab
        if (attr == 'recs') {
            document.querySelector(DOM.chartsTab).classList.remove('active');
            document.querySelector(DOM.recTab).classList.add('active');
        } else {
            document.querySelector(DOM.recTab).classList.remove('active');
            document.querySelector(DOM.chartsTab).classList.add('active');
        }

    };

    return {
        init: function() {
            moment().format();
            uiCtrl.displayMonth();
            budgetCtrl.setLocalStorage();
            loadList();

            var dataObj = budgetCtrl.returnData();
            uiCtrl.updateRest(dataObj);

            // Get income and expenses for pie chart
            getPieCharts();

            setupEventListeners();

            var dataThisMonth = budgetCtrl.filterByMonth();
            console.log(dataThisMonth);
        }
    }

})(budgetController, UIController);

document.addEventListener('DOMContentLoaded', function() {
    // your code here
    mainController.init();
}, false);