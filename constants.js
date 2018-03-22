// namespace-ul jocului
artemis = new function() {
    // intervalul de timp (in milisecunde) pentru actualizarea pozitiei
    this.tMove = 20;
    
    // intervalul de timp folosit pentru actualizarea dimensiunii
    this.tSize = 200;
    
    // intervalul de timp folosit pentru actualizarea scorului
    this.tScore = 100;
    
    // intervalul de timp folosit pentru a verifica daca un caine este langa hrana
    this.tCheckEat = 200;
    
    // intervalul de timp dupa care dispare un punct de hranire
    this.tFood = 10000;

    // intervalul de timp in care un mesaj este vizibil
    this.tMessage = 3000;
    
    // dimensiunea maxima (in pixeli) a unui caine
    this.dMax = 200;
    
    // numarul de pixeli cu care scade dimensiunea unui caine
    this.dogDecreaseSize = 1;
    
    // numarul de pixeli parcursi de un caine in intervalul tMove
    this.dogSpeed = 2;
    
    // numarul de puncte de hrana
    this.nFoodPoints = 9;
    
    // dimensiunea (in pixeli) a unui punct de hrana
    this.foodPointSize = 75;
    
    // indica daca afisam informatii suplimentare, pentru debug
    this.debugMode = false;
    
    // intervalul de timp pentru actualizarea valorilor afisate in debugger
    this.tDebug = 100;

}();