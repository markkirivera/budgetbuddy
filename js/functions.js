// Budget Buddy
var budgetController = (function() {

    var itemsObject, idForDel;

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

    var oldItem = {
        type: '',
        id: ''
    };

    var settings = {
        currency: 'PHP',
        darkMode: 'off',
        defaultView: 'Today',
        symbol: '₱'
    }

    var currView = 'This Month';

    return {

        testing: function() {
            console.log('testing');
        },

        getCurrView: function() {
            return currView;
        },

        setCurrView: function(type) {
            currView = type;
        },

        // Get date/s based on filter type
        setFilterType: function(range, other) {

            var type, response, singleDate;

            if (range == 'Date') {

                response = other;
                type = 'single-date';

                return makeObj(type, false, response);

            } else if (range == 'Today') {

                var curr = moment().format('YYYY-MM-DD');
                response = curr;
                type = 'single-date';

                return makeObj(type, false, response);

            } else if (range == 'Yesterday') {

                var yesterday = moment().add(-1, 'days').format('YYYY-MM-DD');
                response = yesterday;
                type = 'single-date';

                return makeObj(type, false, response);

            } else if (range == 'This Week') {

                var firstday = moment().startOf('week').format('YYYY-MM-DD');
                var lastday = moment().endOf('week').format('YYYY-MM-DD');

                response = [];
                response.push(firstday);
                response.push(lastday);
                type = 'two-dates';

                return makeObj(type, true, response);

            } else if (range == 'Last Week') {

                var lastMonday = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
                var lastSunday = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');

                response = [];
                response.push(lastMonday);
                response.push(lastSunday);
                type = 'two-dates';

                return makeObj(type, true, response);

            } else if (range == 'This Month' || range == 'Remove') {

                var startDate = moment().startOf('month').format("YYYY-MM-DD");
                var endDate = moment().endOf("month").format("YYYY-MM-DD");

                response = [];
                response.push(startDate);
                response.push(endDate);
                type = 'two-dates';

                return makeObj(type, true, response);

            } else if (range == 'Last Month') {

                var startDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
                var endDate = moment().subtract(1, 'month').endOf("month").format("YYYY-MM-DD");

                response = [];
                response.push(startDate);
                response.push(endDate);
                type = 'two-dates';

                return makeObj(type, true, response);

            } else if (range == 'All') {
                response = 'all';
                type = 'all';

                return makeObj(type, false, response);

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
        filterData: function(filterObj) {

            if (filterObj.type == 'single-date') {
                var date = new Date(filterObj.resp).getTime();

                var filteredInc = data.allItems.inc.filter(d => {
                    var time = new Date(d.date).getTime();
                    return (date == time);
                });

                var filteredExp = data.allItems.exp.filter(d => {
                    var time = new Date(d.date).getTime();
                    return (date == time);
                });

                var response = {
                    type: 'all',
                    date: filterObj.date,
                    data: {
                        inc: filteredInc,
                        exp: filteredExp
                    }
                }

                return response;

            } else if (filterObj.type == 'two-dates') {

                var startDate = new Date(filterObj.resp[0]).getTime();
                var endDate = new Date(filterObj.resp[1]).getTime();

                var filteredInc = data.allItems.inc.filter(d => {
                    var time = new Date(d.date).getTime();
                    return (startDate <= time && time <= endDate);
                });

                var filteredExp = data.allItems.exp.filter(d => {
                    var time = new Date(d.date).getTime();
                    return (startDate <= time && time <= endDate);
                });

                var response = {
                    type: 'all',
                    date: filterObj.date,
                    data: {
                        inc: filteredInc,
                        exp: filteredExp
                    }
                }

                return response;

            } else if (filterObj.type == 'all') {

                var filteredInc = data.allItems.inc.filter(d => {
                    return d;
                });

                var filteredExp = data.allItems.exp.filter(d => {
                    return d;
                });

                var response = {
                    type: 'all',
                    date: filterObj.date,
                    data: {
                        inc: filteredInc,
                        exp: filteredExp
                    }
                }

                return response;

            } else {

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
                    type: 'this month',
                    date: filterObj.date,
                    data: {
                        inc: filteredInc,
                        exp: filteredExp
                    }
                }

                return filteredData;

            }
        },

        sortData: function(sortType, object) {

            var newInc, newExp;

            var incObj = object.data.inc;
            var expObj = object.data.exp;

            if (sortType == 'desc') {

                newInc = incObj.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
                newExp = expObj.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

            } else if (sortType == 'new') {

                newInc = incObj.sort(function(a, b) {
                    var c = new Date(a.date);
                    var d = new Date(b.date);
                    return d - c;
                });

                newExp = expObj.sort(function(a, b) {
                    var c = new Date(a.date);
                    var d = new Date(b.date);
                    return d - c;
                });

            } else if (sortType == 'old') {

                newInc = incObj.sort(function(a, b) {
                    var c = new Date(a.date);
                    var d = new Date(b.date);
                    return c - d;
                });

                newExp = expObj.sort(function(a, b) {
                    var c = new Date(a.date);
                    var d = new Date(b.date);
                    return c - d;
                });

            } else {

                newInc = incObj.sort(function(a, b) {
                    return parseFloat(a.value) - parseFloat(b.value);
                });

                newExp = expObj.sort(function(a, b) {
                    return parseFloat(a.value) - parseFloat(b.value);
                });

            }

            var dataObj = {
                inc: newInc,
                exp: newExp
            }

            return dataObj;

        },

        returnIncome: function(incObj) {

            // Create new object for every income
            var income = function(categ, val) {
                this.category = categ;
                this.value = val;
            };

            var incomeObj = [];

            // Return only category and value
            incObj.forEach(function(curr) {
                newItem = new income(curr.category, curr.value);
                incomeObj.push(newItem);
            });

            return incomeObj;

        },

        returnExpenses: function(expObj) {
            // Create new object for every income
            var expense = function(categ, val) {
                this.category = categ;
                this.value = val;
            };

            var expenseObj = [];

            // Return only category and value
            expObj.forEach(function(curr) {
                newItem = new expense(curr.category, curr.value);
                expenseObj.push(newItem);
            });

            return expenseObj;
        },

        // Local Storage - Data
        setLocalStorage: function() {

            // Data
            if (localStorage.getItem('items')) {
                itemsObject = JSON.parse(localStorage.getItem('items'));
                data = itemsObject;
                localStorage.setItem('items', JSON.stringify(itemsObject));
            } else {
                itemsObject = data;
                localStorage.setItem('items', JSON.stringify(itemsObject));
            }

            // Settings
            if (localStorage.getItem('settings')) {
                itemsObject = JSON.parse(localStorage.getItem('settings'));
                settings = itemsObject;
                localStorage.setItem('settings', JSON.stringify(itemsObject));
            } else {
                itemsObject = settings;
                localStorage.setItem('settings', JSON.stringify(itemsObject));
            }
        },

        updateLocalStorageforData: function() {
            localStorage.setItem('items', JSON.stringify(data));
            itemsObject = JSON.parse(localStorage.getItem('items'));
        },

        // Local Storage - Settings
        updateSettings: function(type, value) {
            settings[type] = value;
        },

        updateLocalStorageSettings: function() {
            localStorage.setItem('settings', JSON.stringify(settings));
            itemsObject = JSON.parse(localStorage.getItem('settings'));
        },

        getSettings: function() {
            return settings;
        },

        // Main functions --------------------------------------------------
        addItem: function(type, categ, desc, val, date) {

            var id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

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

        setItemIDforDelete: function(id) {
            idForDel = id;
        },

        getItemIDforDelete: function() {
            return idForDel;
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

        editItem: function(type, id) {

            // 1. Get data object and assign it to a variable
            var getData = data;

            // 2. Find index of array based on type and id
            var index = getData.allItems[type].findIndex(x => x.id === id);
            var arrForEdit = getData.allItems[type][index];

            // 3. Return array
            return arrForEdit;
        },

        filterByCateg: function(type, categ) {

            var filteredData;

            var result = data.allItems[type].filter(obj => {
                return obj.category === categ;
            });

            if (type == 'inc') {
                filteredData = {
                    init: true,
                    type: 'all',
                    date: 'All',
                    data: {
                        inc: result,
                        exp: ''
                    }
                }
            } else {
                filteredData = {
                    init: true,
                    type: 'all',
                    date: 'All',
                    data: {
                        inc: '',
                        exp: result
                    }
                }
            }

            return filteredData;

        },

        setItemTypeID: function(oldType, id) {
            oldItem = {
                type: oldType,
                id: id
            }
        },

        returnItemTypeID: function() {
            return oldItem;
        },

        updateItem: function(type, object) {
            var index = data.allItems[type].findIndex(b => b.id === object.id);
            data.allItems[type].splice(index, 1, object);
        },

        removeItem: function(type, id) {
            var index = data.allItems[type].findIndex(b => b.id === id);

            data.allItems[type].splice(index, 1);
        },

        calcTotalBudget: function(object) {

            var incTotal = 0,
                expTotal = 0,
                budgetTotal = 0,
                percTotal = 0;

            // 1. Calculate total income
            if (object.data.inc.length > 0) {
                object.data.inc.forEach(function(index) {
                    incTotal += index.value;
                });
            }

            if (object.data.exp.length > 0 && incTotal != 0) {

                // 1. Calculate total expenses
                object.data.exp.forEach(function(index) {
                    expTotal += index.value;
                });

                // 2. Then Calculate each expense percentage and total percentage
                object.data.exp.forEach(function(index) {
                    var exp = Math.round((index.value / incTotal) * 100);
                    index.percentage = parseInt(exp);

                    percTotal += index.percentage;
                });

                // 3. Calculate budget
                budgetTotal = incTotal - expTotal;

            } else {

                if (object.data.exp.length > 0) {
                    // Set all expenses to 0
                    object.data.exp.forEach(function(index) {
                        index.percentage = 0;
                    });

                    // Calculate total expenses
                    object.data.exp.forEach(function(index) {
                        expTotal += index.value;
                    });
                }

                // Set other values
                incTotal = incTotal;
                expTotal = expTotal;
                budgetTotal = incTotal - expTotal;;
                percTotal = 0;
            }

            var totalObj = {
                incTotal: incTotal,
                expTotal: expTotal,
                percTotal: percTotal,
                budgetTotal: budgetTotal,
                data: {
                    inc: object.data.inc,
                    exp: object.data.exp
                }
            }

            return totalObj;

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
        },

    }
})();


var UIController = (function() {

    var DOMstrings = {
        body: 'body',
        main: 'main',
        splashScreen: '.splash-screen',

        remainingText: '.budget__value',
        incomeText: '.budget__income--value',
        expenseText: '.budget__expenses--value',
        budgetTitle: '.budget__title',
        floatBtnDiv: '.fixed-action-btn',
        popIncomeText: '.popup__income--value',
        popExpenseText: '.popup__expenses--value',
        inputDesc: '.add__description',
        inputDate: '.add__date',
        inputVal: '.add__value',
        listCont: '.list-container',
        incCont: '.income__list',
        expCont: '.expenses__list',
        dateLabel: '.budget__title--month',
        item: 'item',
        incTitle: '.recs-tab .income__title',
        expTitle: '.recs-tab .expenses__title',

        // Chart
        myChart1: 'myChart1',
        myChart2: 'myChart2',
        incomePie: '.chart-container .income',
        expensePie: '.chart-container .expenses',

        exp: '.exp',
        inc: '.inc',
        tabCont: '.tab-title-container',
        noRecords: '.no-records',
        tabTitle: '.tab-title-container a',
        activeTabTitle: '.tab-title-container a.active',
        recTab: '.recs-tab',
        chartsTab: '.charts-tab',

        // Filtered Category label
        filterTitle: '.filter-title',
        closeFilter: '.filter-title a',

        // Fab
        addBtn: '.add__btn',
        settingsBtn: '.settings__btn',

        //Popup Modal
        scrollDiv: '#scrollDiv',

        warning: '.warning',
        recTypeIncome: '.popup__income',
        recType: '.rec-type',
        recTypeActive: '.rec-type.active',
        categType: '.categ-type',
        recCateg: '.categ-type li',
        incCateg: '.categ-type .inc',
        expCateg: '.categ-type .exp',

        activeRec: '.rec-type.active',
        activeCateg: '.categ-type li.active',

        regDesc: '.desc-container .add__description',
        regDate: '.date-container .add__date',
        regVal: '.val-container .add__value',

        cancelBtn: '.cancel-btn',
        saveBtn: '.save-btn',
        updateBtn: '.update-btn',
        expandBtn: '.expand-btn',

        // Delete Toast
        toast: '.toast',

        // Filter Modal
        date: '.date',
        dateActive: '.date.active',
        recordType: '.record-type a.active',
        sortType: '.sort-type li.active',
        dateDefault: '.date.default',
        datePicker: '.datepicker',
        filterBtn: '.filter-btn',

        // Settings
        infoBtns: '#modal3 h2 i',
        description: '.description',
        darkModeOpt: '.darkmode-type a',
        currOpt: '.curr-type a',
        currOptSpan: '.curr-type a span',
        currencies: '.currency-type li',
        currActiveSpan: '.currency-type li.active span',
        defViewOpt: '.def-view a'

    }

    // Add sign and decimal places to budget
    var formatBudget = function(obj) {

        var numSplit, int, dec, sign;

        if (obj.incTotal > obj.expTotal) {
            sign = '+'
        } else if (obj.expTotal <= obj.incTotal) {
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

        num = Math.abs(obj.budgetTotal);
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

        // Remove all items in the UI
        clearList: function() {
            var paras = document.getElementsByClassName(DOMstrings.item);
            while (paras[0]) {
                paras[0].parentNode.removeChild(paras[0]);
            }
        },

        // Add expense or income to UI
        addListItem: function(obj, type) {

            var html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incCont;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__category">%category%</div><div class="item__date">%date%</div><div class="item__description">%description%</div><div class="amount__cont"><div class="item__value">%value%</div><div class="item__edit"><a class="item__edit--btn"><i class="material-icons">edit</i></a></div><div class="item__delete"><a class="item__delete--btn"><i class="material-icons">delete</i></i></a></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expCont;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__category">%category%</div><div class="item__date">%date%</div><div class="item__description">%description%</div><div class="amount__cont"><div class="item__value">%value%</div><div class="item__percentage">%percentage%%</div><div class="item__edit"><a class="item__edit--btn"><i class="material-icons">edit</i></a></div><div class="item__delete"><a class="item__delete--btn"><i class="material-icons">delete</i></a></div></div></div>'
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

        },

        updateRest: function(dataObj) {

            // format numbers
            var budget, income, expenses;

            budget = formatBudget(dataObj, 'inc');
            income = formatNumber(dataObj.incTotal, 'inc');
            expenses = formatNumber(dataObj.expTotal, 'exp');

            // Remaining Budget
            document.querySelector(DOMstrings.remainingText).textContent = budget;
            document.querySelector(DOMstrings.incomeText).textContent = income;
            document.querySelector(DOMstrings.expenseText).textContent = expenses;
            document.querySelector(DOMstrings.popIncomeText).textContent = income;
            document.querySelector(DOMstrings.popExpenseText).textContent = expenses;

            if (dataObj.percTotal != null && dataObj.percTotal != Infinity) {
                setBudgetProg(dataObj.percTotal);
            } else {
                setBudgetProg(0);
            }

            if (dataObj.percTotal >= 100) {
                $('.ldBar path.mainline, .budget__value').addClass('red');
                // console.log('budget is already reached');
            } else {
                $('.ldBar path.mainline, .budget__value').removeClass('red');
                // console.log('expenses still within budget');
            }

        },

        // Update budget title
        updateRecordTitle: function(label) {

            var now, month, months, year;

            now = new Date();
            months = ['January', 'February', 'March', 'Aprl', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            month = now.getMonth();
            year = now.getFullYear();

            if (label == 'All') {
                document.querySelector(DOMstrings.budgetTitle).innerHTML = 'Showing All Records:';
            } else if (label == 'Today') {
                document.querySelector(DOMstrings.budgetTitle).innerHTML = `Records for ${label}:`;
            } else if (label == 'Date') {
                document.querySelector(DOMstrings.budgetTitle).innerHTML = `Records for ${$(DOMstrings.inputDate)[1].value}: `;
            } else if (label == 'Last Month') {
                document.querySelector(DOMstrings.budgetTitle).innerHTML = `Records from ${months[month - 1]} ${year}:`;
            } else if (label == 'This Month' || label == 'Remove') {
                document.querySelector(DOMstrings.budgetTitle).innerHTML = `Records from ${months[month]} ${year}:`;
            } else {
                document.querySelector(DOMstrings.budgetTitle).innerHTML = `Records from ${label}:`;
            }

        },

        // To Clean -------------------------------------------------------------

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
        },

        toggleIncomeChart: function(type) {
            if (type == 'show') {
                document.querySelector(DOMstrings.incomePie).classList.remove('hide');
                document.querySelector(DOMstrings.incomePie).classList.add(type);
            } else {
                document.querySelector(DOMstrings.incomePie).classList.remove('show');
                document.querySelector(DOMstrings.incomePie).classList.add(type);
            }
        },

        toggleExpensesChart: function(type) {
            if (type == 'show') {
                document.querySelector(DOMstrings.expensePie).classList.remove('hide');
                document.querySelector(DOMstrings.expensePie).classList.add(type);
            } else {
                document.querySelector(DOMstrings.expensePie).classList.remove('show');
                document.querySelector(DOMstrings.expensePie).classList.add(type);
            }
        },

        // Get values of Edit Form
        getEditValues: function() {
            var categActive;

            var newType = document.querySelector(DOMstrings.activeRec).attr("data-value");
            var categ = document.querySelector(DOMstrings.activeCateg);
            var desc = document.querySelector(DOMstrings.regDesc);
            var date = document.querySelector(DOMstrings.regDate);
            var val = document.querySelector(DOMstrings.regVal);

            if (categ != null) {
                categActive = categ.attr("data-value");
            } else {
                categActive = null;
            }

            var item = {
                category: categActive,
                description: desc.value,
                date: date.value,
                value: parseInt(val.value),
            }

            var newItem = {
                newType: newType,
                item: item
            }

            return newItem;
        },

        changeTitleForEdit: function() {
            $('#modal1 .popup-title').text('Edit Record');
            $(DOMstrings.saveBtn).addClass('hide');
            $(DOMstrings.updateBtn).removeClass('hide');
        },

        changeTitleForAdd: function() {
            $('#modal1 .popup-title').text('Add New Record');
            $(DOMstrings.saveBtn).removeClass('hide');
            $(DOMstrings.updateBtn).addClass('hide');
        },

        showWarning: function(index) {

            var element = $('.popup-title');

            var otherWarningDiv = $(DOMstrings.warning);
            if (otherWarningDiv != null) {
                otherWarningDiv.remove();
            }

            var warning = document.createElement('div');

            if (index == 0) {
                warning.innerText = 'Please make sure all fields have their values.';
            } else {
                warning.innerText = "Date doesn't have a value.";
            }

            warning.classList.add('warning');
            warning.id = 'warning';

            var elementParent = element[index].parentNode;
            elementParent.insertBefore(warning, element[index].nextSibling);

        },

        scrollToDiv: function() {
            $('#modal1').animate({ scrollTop: "0px" }, 300);
        },

        showSlide: function(type, index) {

            if (type == 'categ') {
                $('.categ-type-main').slick('slickGoTo', index);
            } else if (type == 'curr') {
                $('.currency-type-main').slick('slickGoTo', index);
            }

        },

        // Show or hide no records div
        toggleEmptyRecords: function(type) {

            if (type == 'show') {
                $(DOMstrings.tabCont).addClass('hide');

                var element = $(DOMstrings.tabCont);

                var warning = document.createElement('h2');
                warning.innerText = "No records for this date. \n Try adding something.";
                warning.classList.add('no-records');

                $('.tab-container')[0].appendChild(warning);
            } else if (type == 'hide') {
                $(DOMstrings.tabCont).removeClass('hide');
                $(DOMstrings.noRecords).remove();
            }

        },

        hideSplash: function() {
            $(DOMstrings.main).removeClass('hide');
            $(DOMstrings.splashScreen).removeClass('show');
            $(DOMstrings.splashScreen).addClass('hide');
        },

        updateSettingsUI: function(object) {

            // Dark mode
            if (object.darkMode == 'on') {
                $('body').addClass('dark');
            } else {
                $('body').removeClass('dark');
            }

            $(DOMstrings.darkModeOpt).removeClass('active');
            $(`.darkmode-type a[data-value="${object.darkMode}"]`).addClass('active');

            // Currency
            $(DOMstrings.currencies).removeClass('active');
            $(`.currency-type li[data-value="${object.currency}"]`).addClass('active');

            // here
            var sym = $(DOMstrings.currActiveSpan)[0].textContent;
            $(DOMstrings.currOptSpan).text(sym);

            var currStr = (object.currency).toLowerCase();
            $(DOMstrings.remainingText).attr('data-curr', currStr);

            // $(DOMstrings.remainingText).append("<span class='curr-sym'>" + sym + '</span>');

            // Default view
            $(DOMstrings.defViewOpt).removeClass('active');
            $(DOMstrings.date).removeClass('active');

            $(`.def-view a[data-value="${object.defaultView}"]`).addClass('active');
            $(`.date-type li[data-value="${object.defaultView}"]`).addClass('active');

        }

    }

})();


var mainController = (function(budgetCtrl, uiCtrl) {

    var DOM = uiCtrl.getDOMstrings();

    // Setup event listeners
    var setupEventListeners = function() {

        // Enter key press
        // document.addEventListener('keypress', function(event) {

        //     var modal1 = $('#modal1');

        //     if (event.keyCode === 13 || event.which === 13 && $('#modal1').hasClass('open') && $('#modal1').hasClass('add') && !$(modal1).hasClass('edit')) {
        //         // ctrlAddNewItem();
        //         console.log($('#modal1'));
        //         console.log('add new item');
        //     } else if (event.keyCode === 13 || event.which === 13 && $('#modal1').hasClass('open') && $('#modal1').hasClass('edit') && !$(modal1).hasClass('add')) {
        //         console.log($('#modal1'));
        //         console.log('edit item');
        //     }
        // });

        $(document).ready(function() {
            $(DOM.floatBtnDiv).floatingActionButton();
        });

        // FAB Add button
        $(DOM.addBtn).click(function() {
            $('#modal1').removeClass('edit');
            $('#modal1').addClass('add');
            uiCtrl.showSlide('categ', 0);
        })

        // Filter by item category
        $(DOM.listCont).on('click', '.item__category', function(e) {

            var categ, itemID, splitID, type;
            categ = $(this).text();

            // Hide filter dot
            $('.filter__btn').removeClass('dot');

            // Get ID of clicked item from parent
            itemID = $(this).parents('div.item').attr('id');

            // 1. Split item ID into arrays eg. inc-1 to 'inc' and 1
            slitID = itemID.split('-');
            type = slitID[0];

            var result = budgetCtrl.filterByCateg(type, categ);
            if (result.data.inc.length == 0 && result.data.exp.length == 0) {
                uiCtrl.toggleEmptyRecords('show');
            } else {
                uiCtrl.toggleEmptyRecords('hide');
            }
            loadNewList(result);

            // Display Filtered by Category label
            $(DOM.filterTitle).addClass('show');

            $('.toast').remove()
            var toastHTML = `<span class="success-toast">Showing records for ${categ}.</span>`;
            M.toast({ html: toastHTML, displayLength: 2000 });

            $(DOM.date).removeClass('active');
            $(".date[data-value='All']").addClass('active');

        });

        // Remove filter by category
        $(DOM.closeFilter).click(function() {

            $(DOM.filterTitle).removeClass('show');

            ctrlApplyFilter('by filter');

            // Get settings
            var settings = budgetCtrl.getSettings();
            uiCtrl.updateSettingsUI(settings);
            ctrlApplyFilter('by filter');

            $(DOM.date).removeClass('active');
            $(DOM.dateDefault).addClass('active');
        });

        // Change input type
        document.querySelector(DOM.budgetTitle).addEventListener('click', openFilterModal);

        // Delete item
        $(DOM.listCont).on('click', '.item__delete--btn', ctrlDeleteToast);

        $(DOM.body).on('click', '.yes-btn', function() {
            var itemID = budgetCtrl.getItemIDforDelete();
            ctrlDeleteItem(itemID);
        });

        $(DOM.body).on('click', '.no-btn', function() {
            $('.toast').remove();
        });

        // Edit button
        $(DOM.listCont).on('click', '.item__edit--btn', function() {

            $('.toast').remove();
            $('#modal1').removeClass('add');
            $('#modal1').addClass('edit');

            var itemID, splitID, type, id, recType;

            // Get ID of clicked item from parent
            itemID = $(this).parents('div.item').attr('id');

            // 1. Split item ID into arrays eg. inc-1 to 'inc' and 1
            slitID = itemID.split('-');
            type = slitID[0];
            id = slitID[1];

            // 2. Send type and ID to find index and retrieve it
            var item = budgetCtrl.editItem(type, id);

            budgetCtrl.setItemTypeID(type, id);

            // 3. Open Add Item modal
            $('#modal1').modal('open');

            uiCtrl.changeTitleForEdit();

            // 4. Set Record Type to active
            $(DOM.recTypeActive).removeClass('active');
            recType = $(`.rec-type[data-value="${type}"]`);
            recType.addClass('active');

            $(DOM.recCateg).removeClass('active');

            // 5. Show Categories per Record Type
            selectRecType(type);

            // 6. Set selected category active
            $(`.categ-type li[data-value="${item.category}"]`).addClass('active');

            // 7. Slide to corresponding slide
            var activeLi = $(`.categ-type li.${type}.active`);
            var parentIndex = activeLi.parents('div.categ-type').data('slick-index');
            uiCtrl.showSlide('categ', parentIndex);

            // 8. Set other values
            $(DOM.inputDesc)[0].value = item.description;
            $(DOM.inputDate)[0].value = item.date;
            $(DOM.inputVal)[0].value = item.value;

        });

        // Update button click
        $(DOM.updateBtn).click(function() {

            // Get input values
            var oldType = budgetCtrl.returnItemTypeID();
            var vals = uiCtrl.getEditValues();

            var newType = vals.newType;
            var newItem = {
                category: vals.item.category,
                description: vals.item.description,
                date: vals.item.date,
                value: parseInt(vals.item.value),
            };

            var sameType = (vals.newType == oldType.type);

            if (newItem.description != '' && newItem.date != '' && newItem.value != '' && isNaN(newItem.value) != true && newItem.category != null) {

                // Add ID to object
                newItem.id = oldType.id;

                // Send input values to save

                if (sameType == true) {

                    // Find index with the same ID
                    budgetCtrl.updateItem(oldType.type, newItem);

                } else {

                    // Find index with the same ID
                    budgetCtrl.removeItem(oldType.type, newItem.id);

                    // Add new item to new type
                    budgetCtrl.addItem(newType, newItem.category, newItem.description, newItem.value, newItem.date);

                }

                // 5. Remove all list in the UI
                uiCtrl.clearList();

                // Get current view variable
                budgetCtrl.getCurrView();
                ctrlApplyFilter('by current view');

                // 12. Update Local Storage
                budgetCtrl.updateLocalStorageforData();

                // Close Modal
                $('#modal1').modal('close');

                // Show toast for success
                $('.toast').remove()
                var toastHTML = '<span class="success-toast"> <i class="material-icons">done</i> Record successfully updated.</span>';
                M.toast({ html: toastHTML, displayLength: 2000 });

                // 4. Clear all input fields
                clearPopupFields();

            } else {

                uiCtrl.showWarning(0);
                uiCtrl.scrollToDiv();

            }

        });


        // Tabs
        var tabs = document.querySelectorAll(DOM.tabTitle);
        for (var i in tabs) {
            tabs[i].onclick = function(e) {
                ctrlShowTab(e);
            };
        }

        // Popup Modal Functions ----------------
        // Modal Initialization
        $(document).ready(function() {
            $('.modal').modal({
                onOpenStart: function() {},
                onOpenEnd: function() {
                    $('#modal1, #modal2, #modal3, #modal4').animate({ scrollTop: "0px" }, 300);
                },
                onCloseEnd: function() {
                    clearPopupFields();
                    uiCtrl.changeTitleForAdd();
                    $('.currency-type-main').addClass('hide');
                }
            });
        });

        // Close modal on swipe down
        $('.popup-title, .modal-title').onSwipe(function(results) {
            if (results.down == true) {
                $('#modal1, #modal2, #modal3, #modal4').modal('close');
            }
        });

        // Filter Modal

        $(document).ready(function() {
            $(DOM.datePicker).datepicker({
                format: 'yyyy-mm-dd'
            });
        });

        // Record options
        $('.record-type a').click(function(e) {
            $('.record-type a').removeClass('active');
            $(this).addClass('active');
        });

        // Sort options
        $('.sort-type .sort').click(function(e) {
            $('.sort-type .sort').removeClass('active');
            $(this).addClass('active');
        });

        // Date options
        $(DOM.date).click(function(e) {
            $(DOM.date).removeClass('active');
            e.currentTarget.classList.add('active');
        });

        // Filter Records by Date
        $(DOM.date).click(function() {

            var dateVal = $(this).data('value');

            if (dateVal == 'Date') {
                $('#modal2 .date-container').removeClass('hide');
            } else {
                $('#modal2 .date-container').addClass('hide');
            }

        });

        // Apply filter
        document.querySelector(DOM.filterBtn).addEventListener('click', callApplyFilter);

        // Add New Record Modal
        $(DOM.recType).click(function(e) {

            $(DOM.recType).removeClass('active');
            $(DOM.recCateg).removeClass('active');

            e.currentTarget.classList.add('active');

            var type = $(DOM.recTypeActive).data('value');
            selectRecType(type);

            var warnDiv = $(DOM.warning);
            if (warnDiv.length != 0) {
                $(DOM.warning).remove();
            }

            $('.categ-type-main').slick('slickGoTo', 0);

        });

        $(DOM.recCateg).click(function(e) {
            var categ = this.attr("data-value");
            selectCategType(e, categ);
        });

        document.querySelector(DOM.saveBtn).addEventListener('click', ctrlAddNewItem);
        document.querySelector(DOM.cancelBtn).addEventListener('click', clearPopupFields);
        document.querySelector(DOM.expandBtn).addEventListener('click', ctrlExpandCateg);

        // Settings tips
        $(DOM.infoBtns).click(ctrlShowDescriptions);

        // FAB Settings button
        $(DOM.settingsBtn).click(function() {
            uiCtrl.showSlide('curr', 0);
        });

        // Dark Mode
        $(DOM.darkModeOpt).click(function() {

            var dataVal = $(this).data('value');

            // Update Settings object
            budgetCtrl.updateSettings('darkMode', dataVal);
            budgetCtrl.updateLocalStorageSettings();

            // Toggle dark class on body
            var settingsObj = budgetCtrl.getSettings();
            uiCtrl.updateSettingsUI(settingsObj);

            // Show toast
            var toastHTML = `<span class="success-toast"> <i class="material-icons">nights_stay</i> Dark mode is turned ${dataVal}.</span>`;
            $('.toast').remove()
            M.toast({ html: toastHTML, displayLength: 2000 });

        });

        // Currency
        $('.curr-desc, .curr-type a').click(function() {

            $('.currency-type-main').toggleClass('hide');
            uiCtrl.showSlide('curr', 0);

        });

        $(DOM.currencies).click(function() {
            var curr = $(this).data('value');
            var sym = $(this).find('span')[0].textContent;

            // Update Settings object
            budgetCtrl.updateSettings('currency', curr);
            budgetCtrl.updateSettings('symbol', sym);
            budgetCtrl.updateLocalStorageSettings();

            // Update currency UI
            var settingsObj = budgetCtrl.getSettings();
            uiCtrl.updateSettingsUI(settingsObj);

            var toastHTML = `<span class="success-toast"> <i class="material-icons">calendar_today</i> Default currency is set to ${curr}.</span>`;
            $('.toast').remove()
            M.toast({ html: toastHTML, displayLength: 2000 });

        });

        // Default View
        $(DOM.defViewOpt).click(function() {

            var dataVal = $(this).data('value');

            // Update Settings object
            budgetCtrl.updateSettings('defaultView', dataVal);
            budgetCtrl.updateLocalStorageSettings();

            // Update default view
            var settingsObj = budgetCtrl.getSettings();
            uiCtrl.updateSettingsUI(settingsObj);

            // Set filter
            // ctrlApplyFilter('by filter');

            var toastHTML = `<span class="success-toast"> <i class="material-icons">euro</i> Default view for records is set to ${dataVal}.</span>`;
            $('.toast').remove()
            M.toast({ html: toastHTML, displayLength: 2000 });

        });

    }

    // End for event listeners -------------------------

    var ctrlShowDescriptions = function() {

        var desc = $(this).parent().next('p');

        if (desc.hasClass('show')) {
            $(DOM.description).removeClass('show');
            desc.removeClass('show');
        } else {
            $(DOM.description).removeClass('show');
            desc.addClass('show');
        }

    }

    var openFilterModal = function() {
        $('#modal2').modal('open');
    }

    var callApplyFilter = function() {

        // Check if date filter is selected and date picker has a value
        var dateVal = $(DOM.dateActive).attr("data-value");
        var filterDate = $(DOM.inputDate)[1].value;

        if (dateVal == 'Date' && filterDate == '') {

            uiCtrl.showWarning(1);

        } else {
            $('#modal2').modal('close');
            $('.filter__btn').addClass('dot');
            ctrlApplyFilter('by filter');

            // Show toast
            $('.toast').remove()
            var toastHTML = '<span class="success-toast"> <i class="material-icons">done</i> Filter applied.</span>';
            M.toast({ html: toastHTML, displayLength: 2000 });
        }

    }

    var ctrlApplyFilter = function(type) {

        var filterObj;

        // Get recor and sort type
        var filterRecord = $(DOM.recordType).attr("data-value");
        var filterSort = $(DOM.sortType).attr("data-value");

        if (type == 'by filter') {

            // Hide filter by category div
            $(DOM.filterTitle).removeClass('show');

            // Get record type
            var filterDate = $(DOM.dateActive).attr("data-value");

            var filterRes;

            // Set 'This Month' as active if Remove Filter is clicked
            if (filterDate == 'Remove') {

                $(DOM.date).removeClass('active');
                $(DOM.dateDefault).addClass('active');

                filterRes = budgetCtrl.setFilterType(filterDate);
                budgetCtrl.setCurrView(filterDate);

            } else if (filterDate == 'Date') {

                var dateVal = $(DOM.inputDate)[1].value;

                filterRes = budgetCtrl.setFilterType(filterDate, dateVal);
                budgetCtrl.setCurrView(filterDate);

            } else {

                filterRes = budgetCtrl.setFilterType(filterDate);
                budgetCtrl.setCurrView(filterDate);

            }

            filterObj = {
                init: false,
                date: filterDate,
                type: filterRes.type,
                isArr: filterRes.isArray,
                resp: filterRes.resp
            }

        } else if (type == 'by current view') {

            var currView = budgetCtrl.getCurrView();
            var filterRes = budgetCtrl.setFilterType(currView);
            var filterDate = currView;

            // Set 'This Month' as active if Remove Filter is clicked
            if (filterDate == 'Remove') {
                $(DOM.date).removeClass('active');
                $(DOM.dateDefault).addClass('active');
            }

            filterObj = {
                init: false,
                date: filterDate,
                type: filterRes.type,
                isArr: filterRes.isArray,
                resp: filterRes.resp
            }

            budgetCtrl.setCurrView(filterDate);
        }

        var resp = budgetCtrl.filterData(filterObj);

        if (resp.data.inc.length == 0 && resp.data.exp.length == 0) {
            uiCtrl.toggleEmptyRecords('show');
        } else {
            uiCtrl.toggleEmptyRecords('hide');
        }

        // Sort objects
        var sortedData = budgetCtrl.sortData(filterSort, resp);

        // Modify new object
        if (filterRecord == 'all') {
            resp.data.inc = sortedData.inc;
            resp.data.exp = sortedData.exp;
        } else if (filterRecord == 'inc') {
            resp.data.inc = sortedData.inc;
            resp.data.exp = '';
        } else if (filterRecord == 'exp') {
            resp.data.inc = '';
            resp.data.exp = sortedData.exp;
        }

        loadNewList(resp);

        var totalBudget = budgetCtrl.calcTotalBudget(resp);
        uiCtrl.updateRest(totalBudget);

        // Get income and expenses for pie chart
        getPieCharts(totalBudget);

    };

    // Select Record Type - income or expense
    var selectRecType = function(type) {
        if (type == 'inc') {
            $(DOM.incCateg).removeClass('hide');
            $(DOM.expCateg).addClass('hide');
        } else if (type == 'exp') {
            $(DOM.incCateg).addClass('hide');
            $(DOM.expCateg).removeClass('hide');
        }
    }

    // Select Record Category
    var selectCategType = function(e, categ) {
        $(DOM.recCateg).removeClass('active');
        e.currentTarget.classList.add('active');

        $(DOM.regDesc)[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
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

            // Get current view variable
            budgetCtrl.getCurrView();
            ctrlApplyFilter('by current view');

            // 12. Update Local Storage
            budgetCtrl.updateLocalStorageforData();

            // Close Modal
            $('#modal1').modal('close');

            // Show toast
            $('.toast').remove()
            var toastHTML = '<span class="success-toast"> <i class="material-icons">done</i> Record successfully added.</span>';
            M.toast({ html: toastHTML, displayLength: 2000 });

        } else {

            uiCtrl.showWarning(0);
            uiCtrl.scrollToDiv();

        }

    }

    var ctrlDeleteToast = function(event) {
        // Show toast
        $('.toast').remove()
        var toastHTML = '<span class="delete-toast"> <i class="material-icons">help_outline</i> Delete this item?</span><div class="float-right"><button class="no-btn btn-flat toast-action">No</button><button class="yes-btn btn-flat toast-action">Yes</button></div>';
        M.toast({ html: toastHTML, displayLength: 2000 });

        itemID = $(this).parents('div.item').attr('id');

        budgetCtrl.setItemIDforDelete(itemID);

    }

    var ctrlDeleteItem = function(item) {

        var itemID, splitID, type, ID;
        itemID = item;

        if (itemID) {

            // 1. Split item ID into arrays eg. inc-1 to 'inc' and 1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];

            // 2. Remove item based on type and ID
            budgetCtrl.deleteItem(type, ID);

            // // 5. Remove all list in the UI
            uiCtrl.clearList();

            // Get current view variable
            budgetCtrl.getCurrView();
            ctrlApplyFilter('by current view');

            // // 8. Update Local Storage
            budgetCtrl.updateLocalStorageforData();

            // Show toast
            $('.toast').remove()
            var toastHTML = '<span class="delete-toast"> <i class="material-icons">done</i> Record successfully deleted.</span>';
            M.toast({ html: toastHTML, displayLength: 2000 });
        }

    }

    // Clear all fields on add item popup modal
    var clearPopupFields = function() {
        var recTypeIncome = $(DOM.recTypeIncome);
        var activeCateg = $(DOM.activeCateg);
        var regDesc = $(DOM.regDesc)[0];
        // var regDate = $(DOM.regDate);
        var regVal = $(DOM.regVal)[0];
        var warning = $(DOM.warning);

        $(DOM.scrollDiv)[0].scrollIntoView({ behavior: 'smooth', block: 'start' });

        $(DOM.recType).removeClass('active');
        $(DOM.incCateg).removeClass('hide');
        $(DOM.expCateg).addClass('hide');

        recTypeIncome.addClass('active');
        activeCateg.removeClass('active');

        regDesc.value = "";
        regVal.value = "";

        warning.remove();

        ctrlExpandCateg();

    }

    // Load list to the UI
    var loadNewList = function(listObj) {

        $('.income__list .item').remove();
        $('.expenses__list .item').remove();

        if (listObj.data.inc.length > 0) {

            uiCtrl.toggleIncTitle('show');

            // 1. Load income
            listObj.data.inc.forEach(function(curr) {
                uiCtrl.addListItem(curr, 'inc');
            });

            // if (listObj.data.inc.length > 6) {
            //     alert(listObj.data.inc.length);
            //     $(DOM.incCont).addClass('mCustomScrollbar');
            // } else {
            //     $(DOM.incCont).removeClass('mCustomScrollbar');
            // }

        } else {
            uiCtrl.toggleIncTitle('hide');
            $(DOM.expCont).removeClass('mCustomScrollbar');
        }

        if (listObj.data.exp.length > 0) {

            uiCtrl.toggleExpTitle('show');

            // 2. Load expenses
            listObj.data.exp.forEach(function(curr) {
                uiCtrl.addListItem(curr, 'exp');
            });

            // if (listObj.data.exp.length > 6) {
            //     alert(listObj.data.exp.length);
            //     $(DOM.expCont).addClass('mCustomScrollbar');
            // } else {
            //     $(DOM.expCont).removeClass('mCustomScrollbar');
            // }
        } else {
            uiCtrl.toggleExpTitle('hide');
            $(DOM.expCont).removeClass('mCustomScrollbar');
        }

        if (listObj.init != true) {
            // $('#modal2').modal('close');
        }

        uiCtrl.updateRecordTitle(listObj.date);

        return listObj.date;

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
    var getIncome = function(dataInc) {

        var incomeVal = [];
        var incomeLab = [];

        var income = budgetCtrl.returnIncome(dataInc);

        var mergeArr = mergeObject(income);

        if (mergeArr.length > 0) {
            mergeArr.forEach(function(curr) {
                incomeVal.push(curr.value);
                incomeLab.push(curr.category);
            });

            uiCtrl.toggleIncomeChart('show');
            incomeChart(incomeVal, incomeLab);
        } else {
            uiCtrl.toggleIncomeChart('hide');
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
    var getExpenses = function(dataExp) {

        var expensesVal = [];
        var expensesLab = [];

        var expenses = budgetCtrl.returnExpenses(dataExp);

        var mergeArr = mergeObject(expenses);

        if (mergeArr.length > 0) {
            mergeArr.forEach(function(curr) {
                expensesVal.push(curr.value);
                expensesLab.push(curr.category);
            });

            uiCtrl.toggleExpensesChart('show');
            expensesChart(expensesVal, expensesLab);
        } else {
            uiCtrl.toggleExpensesChart('hide');
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

    var getPieCharts = function(dataObj) {

        // if (dataObj.data.inc.length > 0 && dataObj.data.exp.length > 0) {
        //     getIncome(dataObj.data.inc);
        //     getExpenses(dataObj.data.exp);
        // } else {
        //     // expensesChart(expensesVal, expensesLab);
        // }

        if (dataObj.data.inc.length > 0) {
            getIncome(dataObj.data.inc);
        } else {
            uiCtrl.toggleIncomeChart('hide');
        }

        if (dataObj.data.exp.length > 0) {
            getExpenses(dataObj.data.exp);
        } else {
            uiCtrl.toggleExpensesChart('hide');
        }

    }

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

    }

    return {
        init: function() {

            // Initializations ----

            // Slick JS
            $('.categ-type-main, .currency-type-main').slick({
                dots: true,
                infinite: false
            });

            // Splash screen
            setTimeout(function() {
                uiCtrl.hideSplash();
            }, 2000);

            moment().format();
            setupEventListeners();
            budgetCtrl.setLocalStorage();

            // Get settings
            var settings = budgetCtrl.getSettings();
            uiCtrl.updateSettingsUI(settings);
            ctrlApplyFilter('by filter');

        }
    }

})(budgetController, UIController);

document.addEventListener('DOMContentLoaded', function() {
    mainController.init();
}, false);