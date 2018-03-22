// clasa Dog
artemis.Dog = function(dogSpeed) {
    // variabile private
    var htmlElement;
    
    var speed = dogSpeed;
    
    var destinationPosition;
    
    var centerPosition;
    
    var size;
    
    var alive;


    // intoarce elementul html ("img"-ul) asociat acestui caine
    this.getHtmlElement = function() {
        return htmlElement;
    }
    

    // seteaza elementul html ("img"-ul) asociat acestui caine
    this.setHtmlElement = function(elem) {
        htmlElement = elem;
    }


    // verifica daca acest caine este in viata
    this.isAlive = function() {
        return alive;
    }   
    

    // seteaza daca acest caine este in viata
    this.setAlive = function(isAlive) {
        alive = isAlive;
        artemis.domUtils.setVisible(htmlElement, isAlive);
    }
    

    // intoarce dimensiunea cainelui
    this.getSize = function() {
        return size;
    }


    // seteaza dimensiunea cainelui
    this.setSize = function(sz) {
        size = sz;
        artemis.domUtils.setSize(htmlElement, size, size);
    }


    // modifica dimensiunea cainelui (se micsoreaza daca valoarea parametrului e negativa)
    this.increaseSize = function(d) {
        newSize = size + d;
        if (newSize < 0) {
            newSize = 0;
        }
        
        this.setSize(newSize);
    }


    // intoarce pozitia la care se afla cainele
    this.getCenterPosition = function() {
        return centerPosition;
    }
    

    // intoarce pozitia la care se afla cainele
    this.setCenterPosition = function(posX, posY) {
        centerPosition = {
            x: posX,
            y: posY
        }
        
        artemis.domUtils.setCenterPosition(htmlElement, posX, posY);
    }
    
    
    // intoarce destinatia acestui caine
    this.getDestinationPosition = function() {
        return destinationPosition;
    }
    

    // seteaza destinatia acestui caine
    this.setDestinationPosition = function(dstX, dstY) {
        destinationPosition = { x: dstX, y: dstY };
    }
    

    // functie apelata periodic pentru a misca acest caine
    this.updatePosition = function() {
        if (!alive) {
            return;
        }
        
        currentPosition = this.getCenterPosition();
        
        var dx = destinationPosition.x - currentPosition.x;
        var dy = destinationPosition.y - currentPosition.y;
                
        // distanta cainelui pana la destinatie
        var d = Math.sqrt(dx * dx + dy * dy);
                
        if (d < speed) {
            // destinatia a fost atinsa,
            // seteaza aleator o noua destinatie
            dstX = Math.random() * (W - artemis.dMax) + artemis.dMax / 2;
            dstY = Math.random() * (H - artemis.dMax) + artemis.dMax / 2;
            this.setDestinationPosition(dstX, dstY);
        } else {
            // destinatia nu a fost inca atinsa, avanseaza spre destinatie
            dx2 = dx * dogSpeed / d;
            dy2 = dy * dogSpeed / d;
            
            // actualizeaza pozitia
            var newX = currentPosition.x + dx2;
            var newY = currentPosition.y + dy2;
            
            this.setCenterPosition(newX, newY);
        }
    }


}