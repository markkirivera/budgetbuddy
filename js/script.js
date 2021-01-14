var books = {
    allItems: {
        novel: [
            { id: 1, name: 'Name of the Wind', year: 2015, rating: 4.5, author: 2 },
            { id: 2, name: 'The Fault in Our Stars', year: 2014, rating: 4, author: 1 }
        ],
        comics: [
            { id: 3, name: 'Archie', year: 2010, rating: 4.2, author: 3 },
            { id: 4, name: 'Justice League', year: 2000, rating: 4.6, author: 4 },
        ]
    }
};

var indexController = (function() {
    return {

        testing: function() {
            // console.log('testing');
            if (/Android [4-6]/.test(navigator.appVersion)) {
                window.addEventListener("resize", function() {
                    if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
                        window.setTimeout(function() {
                            document.activeElement.scrollIntoViewIfNeeded();
                        }, 0);
                    }
                });
                // alert('hello');
            }
        },

    }
})();

var uiController = (function() {
    return {

    }
})();

var mainController = (function(indexCtrl, uiCtrl) {

    return {
        init: function() {
            indexCtrl.testing();
        }
    }

})(indexController, uiController);

mainController.init();