// exista un singur element de tipul DomUtils
artemis.domUtils = new function() {
    // verifica daca doua elemente sunt in coliziune
    this.checkCollision = function(elem1, elem2) {
        var r1 = elem1.getBoundingClientRect();
        var r2 = elem2.getBoundingClientRect();
        if ((r1.top > r2.bottom) ||         // dreptunghiul 1 este mai jos decat dreptunghiul 2 
                (r1.bottom < r2.top) ||     // dreptunghiul 1 este mai sus decat dreptunghiul 2
                (r1.left > r2.right) ||     // dreptunghiul 1 este mai la dreapta decat dreptunghiul 2
                (r1.right < r2.left)) {     // dreptunghiul 1 este mai la stanga decat dreptunghiul 2
            return false;
        } else {
            return true;
        }
    };


    // creaza un element, dar nu il adauga inca in documentul html
    this.createImgElement = function(src) {
        var elem = document.createElement("img");
        elem.setAttribute("src", src);
        elem.style.position = "absolute";
        
        return elem;
    };

    
    // adauga un element in documentul html
    this.addElement = function(elem) {
        document.getElementById("gameDiv").appendChild(elem);
    };

   
    // sterge un element din documentul html
    this.removeElement = function(elem) {
        var parent = elem.parentElement;
        parent.removeChild(elem);
    };


    // seteaza pozitia pentru centrul unui element
    this.setCenterPosition = function(elem, x, y) {
        elem.style.left = (x - elem.offsetWidth / 2) + "px";
        elem.style.top = (y - elem.offsetHeight / 2) + "px";        
    };


    // intoarce pozitia centrului unui element (x si y)
    this.getCenterPosition = function(elem) {
        var r = elem.getBoundingClientRect();
        var position = { 
            x: (r.left + r.right) / 2, 
            y: (r.top + r.bottom) / 2 
        };

        return position;
    };

    
    // seteaza dimensiunea unui element
    this.setSize = function(elem, w, h) {
        elem.setAttribute("width", w);
        elem.setAttribute("height", h);
    };

    
    // intoarce dimensiunea unui element (width si height)
    this.getSize = function(elem) {
        var size = {
            w: Number(elem.getAttribute("width")),
            h: Number(elem.getAttribute("height"))
        }
        
        return size;
    };
    

    // seteaza vizibilitatea unui element
    this.setVisible = function(elem, visible) {
        elem.style.display = visible ? "block" : "none";
    };
    

    // verifica daca elementul este vizibil
    this.getVisible = function(elem) {
        return elem.style.display != "none";
    };
    
    
}();