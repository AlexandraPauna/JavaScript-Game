// clasa FoodPoint
artemis.FoodPoint = function(img) {
    // elementul html pentru punctul de hrana
    var htmlElement;
    
    var centerPosition;
    
    var active;
    
    // elementul html pentru mancarea plasata in interiorul acestui punct de hrana
    var foodHtmlElement;


    // intoarce elementul html ("img"-ul) pentru acest punct de hrana
    this.getHtmlElement = function() {
        return htmlElement;
    }
    

    // seteaza elementul html ("img"-ul) pentru acest punct de hrana
    this.setHtmlElement = function(elem) {
        htmlElement = elem;
    }
    

    // seteaza elementul html ("img"-ul) pentru mancarea plasata in acest punct de hrana
    this.setFoodHtmlElement = function(elem) {
        foodHtmlElement = elem;
    }
    

    // intoarce pozitia centrului acestui punct de hrana
    this.getCenterPosition = function getCenterPosition() {
        return centerPosition;
    }

    // seteaza pozitia centrului acestui punct de hrana
    this.setCenterPosition = function setCenterPosition(x, y) {
        centerPosition = {
            x: x,
            y: y
        }
        
        artemis.domUtils.setCenterPosition(htmlElement, x, y);
    }


    // activeaza acest punct de hrana (initial fara mancare in interior)
    this.activate = function() {
        active = true;
        artemis.domUtils.setVisible(htmlElement, true);
    }


    // dezactiveaza acest punct de hrana
    this.deactivate = function() {
        active = false;
        artemis.domUtils.setVisible(htmlElement, false);
        artemis.domUtils.setVisible(foodHtmlElement, false);
    }
    

    // verifica daca acest punct de hrana este activ
    this.isActive = function() {
        return active;
    }


    // adauga mancare in acest punct de hrana
    this.addFood = function() {
        artemis.domUtils.setVisible(foodHtmlElement, true);
        var pos = this.getCenterPosition();
        artemis.domUtils.setCenterPosition(foodHtmlElement, pos.x, pos.y);
    }
    

    // elimina mancarea din acest punct de hrana
    this.removeFood = function() {
        artemis.domUtils.setVisible(foodHtmlElement, false);
    }
        

    // verifica daca exista mancare in acest punct de hrana
    this.hasFood = function() {
        return artemis.domUtils.getVisible(foodHtmlElement);
    }
    
    
}