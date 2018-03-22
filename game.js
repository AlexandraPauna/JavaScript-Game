// avem un singur obiect de tip Game, el gestioneaza toate elementele jocului
artemis.game = new function() {
    // array de caini
    var dogs = [];
    
    // array de puncte de hrana
    var foodPoints = [];
    
    // pozitia mouse-ului in cadrul div-ului
    var mouseX;
    var mouseY;

    // momentul in care a inceput jocul
    var startTime;
    
    // indica daca am pierdut
    var isGameOver = false;
    var isInitialized = false;
    
    // id-uri intoarse de setInterval pentru a permite oprirea apelurilor
    var intervalScore;
    var intervalMove;
    var intervalResize;
    var timeoutMessage;
    
    // numarul de vieti ramase
    var nLives;
    
    // numarul de caini
    var nDogs;
    
    
    this.getDogs = function() {
        return dogs;
    }


    // intoarce distanta dintre doua pozitii
    function distance(pos1, pos2) {
        var dx = pos1.x - pos2.x;
        var dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    

    function clearMessage() {
        document.getElementById("messagesDiv").innerHTML = "";
    }
    

    function displayMessage(msgId) {
        clearTimeout(timeoutMessage);
        document.getElementById("messagesDiv").innerHTML = artemis.loader.getMessage(msgId);
        timeoutMessage = setTimeout(clearMessage, artemis.tMessage);
    }


    // un caine mananca hrana dintr-un punct de hrana
    function eat(dog, foodPoint) {
        if (!foodPoint.hasFood()) {
            return;
        }
        
        // verificam daca sunetul a fost selectat in pagina de setari
        if (localStorage.getItem('latrat') != '') {
            var audio = artemis.loader.getAudio('latrat').sound;
            audio.volume = localStorage.getItem('volume');
            audio.play();
        }
        
        foodPoint.removeFood();

        dog.increaseSize(artemis.dMax / 10);
        if (dog.getSize() >= artemis.dMax) {
            lifeLost(dog);
        }
    }
    

    // functie apelata in momentul in care jucatorul a ramas fara vieti
    function gameOver() {
        isGameOver = true;
        
        var gameDiv = document.getElementById("gameDiv");
        artemis.domUtils.removeElement(gameDiv);

        displayMessage('game_over');
        
        clearInterval(intervalMove);
        clearInterval(intervalResize);
        clearInterval(intervalScore);
        clearInterval(intervalFood);
        clearTimeout(timeoutMessage);
        
        // verificam daca sunetul a fost selectat in pagina de setari
        if (localStorage.getItem('game_over') != '') {        
            var audio = artemis.loader.getAudio('game_over').sound;
            audio.volume = localStorage.getItem('volume');
            audio.play();
        }
        
        updateScore();
    }


    // actualizeaza pozitiile tuturor cainilor
    function moveDogs() {
        for (var i = 0; i < dogs.length; i++) {
            dog = dogs[i];
            dog.updatePosition();
        }
    }


    function lifeLost(dog) {
        if (isGameOver) {
            return;
        }
        
        dog.setAlive(false);
        nLives--;

        displayMessage('mort');
        
        if (nLives > 0) {
            // verificam daca sunetul a fost selectat in pagina de setari
            if (localStorage.getItem('trist') != '') {
                var audio = artemis.loader.getAudio('trist').sound;
                audio.volume = localStorage.getItem('volume');
                audio.play();
            }
        } else if (nLives == 0) {
            gameOver();
        }
    }
    
    
    // functie apelata periodic pentru a verifica daca vreun caine poate sa 
    // manance din unul din punctele de hrana
    function checkEat() {
        // verific coliziuni intre caini si punctele de hrana
        for (var j = 0; j < foodPoints.length; j++) {
            foodPoint = foodPoints[j];
            // iau in calcul punctele de hrana active si care au mancare
            if (!foodPoint.isActive()) {
                continue;
            }
            
            if (!foodPoint.hasFood()) {
                continue;
            }

            var nearestDog = undefined;
            var minDist;
            for (var i = 0; i < dogs.length; i++) {
                var dog = dogs[i];
                // iau in calcul cainii care mai sunt in viata
                if (!dog.isAlive()) {
                    continue;
                }
                // verific coliziunea
                dogElem = dog.getHtmlElement();
                foodPointElem = foodPoint.getHtmlElement();
                if (artemis.domUtils.checkCollision(dogElem, foodPointElem)) {
                    var d = distance(dog.getCenterPosition(), foodPoint.getCenterPosition());

                    if (nearestDog == undefined || d < minDist) {
                        minDist = d;
                        nearestDog = dog;
                    }
                }
            }
            
            if (nearestDog != undefined) {
                eat(nearestDog, foodPoint);
            }
        }
    }
    

    // functie apelata periodic pentru a micsora cainii
    function resizeDogs() {
        for (var i = 0; i < dogs.length; i++) {
            dog = dogs[i];
            
            if (!dog.isAlive()) {
                continue;
            }
            
            dog.increaseSize(-artemis.dogDecreaseSize);
            
            if (dog.getSize() <= 0) {
                lifeLost(dog);
            }
        }
    }
        

    // functie apelata pentru a incerca plasarea unui punct de hrana
    // (este apelata la apasarea unei cifre)
    function placeFoodPoint(idx, x, y) {       
        var foodPoint = foodPoints[idx];
        if (foodPoint.isActive()) {
            displayMessage('atentie');
            return;
        }
        
        var htmlElement = foodPoint.getHtmlElement();
        
        // plasez punctul de hrana si verific daca exista 
        // coliziuni cu alte puncte de hrana
        var collision = false;
        foodPoint.activate();
        foodPoint.setCenterPosition(x, y);

        for (var i = 0; i < artemis.nFoodPoints; i++) {
            if (i == idx) {
                continue;
            }

            var otherFoodPoint = foodPoints[i];
            if (!otherFoodPoint.isActive()) {
                continue;
            }
            
            var otherHtmlElement = otherFoodPoint.getHtmlElement();
            if (artemis.domUtils.checkCollision(htmlElement, otherHtmlElement)) {
                collision = true;
                break;
            }
        }
        
        if (collision) {
            foodPoint.deactivate();
            return;
        }
        
        // nu exista conflicte - punctul de hrana ramane activ        
        setTimeout(foodPoint.deactivate, artemis.tFood);
        
        // gaseste cel mai apropiat caine si actualizeaza destinatia sa
        var dogIdx = -1;
        var dMin;
        for (var i = 0; i < dogs.length; i++) {
            var dog = dogs[i];
            if (!dog.isAlive()) {
                continue;
            }
            
            // calculeaza distanta dintre caine si punctul de hrana
            var d = distance(dog.getCenterPosition(), foodPoint.getCenterPosition());
            
            if (dogIdx == -1 || d < dMin) {
                dMin = d;
                dogIdx = i;
            }
        }
        
        dogs[dogIdx].setDestinationPosition(x, y);
    }    


            
    // functie apelata periodic pentru a afisa informatii actualizate despre scor
    function updateScore() {
        var scor = artemis.loader.getMessage("scor");
        var vieti = artemis.loader.getMessage("vieti");
        document.getElementById("scoreDiv").innerHTML = scor.concat(": ", (Date.now() - startTime));
        document.getElementById("livesDiv").innerHTML = vieti.concat(": ", nLives);
    }
 

    // seteaza configuratia initiala a cainilor
    function initDogs(dogSpeed) {
        selectedDogTypes = [];
        for (var i = 0; i < artemis.loader.settings.dogTypes.length; i++) {
            dogType = artemis.loader.settings.dogTypes[i];
            id = dogType.imgId;
            if (localStorage.getItem(id) != "") {
                selectedDogTypes.push(dogType);     // retine cainii selectati
            }
        }
        
        for (var i = 0; i < nDogs; i++) {
            var dog = new artemis.Dog(dogSpeed);

            // creaza element html
            nDogTypes = selectedDogTypes.length;
            dogIdx = Math.floor(Math.random() * nDogTypes);
            dogType = selectedDogTypes[dogIdx];
            
            imgSrc = artemis.loader.getImage(dogType.imgId).src;
            htmlElement = artemis.domUtils.createImgElement(imgSrc);

            artemis.domUtils.addElement(htmlElement);
            dog.setHtmlElement(htmlElement);

            // seteaza pozitii initiale aleator
            var x = Math.random() * (W - artemis.dMax) + artemis.dMax / 2;
            var y = Math.random() * (H - artemis.dMax) + artemis.dMax / 2;
            dog.setCenterPosition(x, y);
            
            // seteaza destinatii aleator
            var dstX = Math.random() * (W - artemis.dMax) + artemis.dMax / 2;
            var dstY = Math.random() * (H - artemis.dMax) + artemis.dMax / 2;
            dog.setDestinationPosition(dstX, dstY);

            // dimensiunea initiala
            dog.setSize(artemis.dMax / 2);
            
            dog.setAlive(true);
            
            dogs.push(dog);
        }
    }


    // initializeaza punctele de hrana (initial toate sunt invizibile)
    function initFoodPoints() {
        for (var i = 0; i < artemis.nFoodPoints; i++) {
            var foodPoint = new artemis.FoodPoint();
            // elementul html pentru punctul de hranire
            imgFile = artemis.loader.getImage("punct_" + (i + 1)).src;
            htmlElement = artemis.domUtils.createImgElement(imgFile);
            artemis.domUtils.setSize(htmlElement, artemis.foodPointSize, artemis.foodPointSize);
            artemis.domUtils.addElement(htmlElement);
            foodPoint.setHtmlElement(htmlElement);
            
            // elementul html pentru hrana
            imgFile = artemis.loader.getImage("os").src;
            foodHtmlElement = artemis.domUtils.createImgElement(imgFile);
            artemis.domUtils.setSize(foodHtmlElement, artemis.foodPointSize, artemis.foodPointSize / 2);
            artemis.domUtils.addElement(foodHtmlElement);
            foodPoint.setFoodHtmlElement(foodHtmlElement);

            // initial fiecare punct de hrana este dezactivat
            foodPoint.deactivate();

            // adauga punctul curent in lista cu toate punctele de hrana
            foodPoints.push(foodPoint);
        }
    }
    

    this.onKeyPress = function(event) {
        if (isGameOver || !isInitialized) {
            return;
        }
        
        key = event.which ? event.which: event.keyCode;
        
        if (key >= 49 && key < 58) {
            // a fost apasata o cifra
            // calculam indicele punctului de hrana asociat
            idx = key - 49;
            if (mouseX != undefined && mouseY != undefined) {
                placeFoodPoint(idx, mouseX, mouseY);
            }
        } else {
            // a fost apasat shift + o cifra
            map = [];
            map[33] = 0; 
            map[64] = 1; 
            map[35] = 2; 
            map[36] = 3; 
            map[37] = 4;
            map[94] = 5;
            map[38] = 6;
            map[42] = 7;
            map[40] = 8;
            if (map[key] != undefined) {
                foodPoint = foodPoints[map[key]];
                if (foodPoint.isActive()) {
                    foodPoint.addFood();
                }
            }
        }
    },
           

    this.onMouseMove = function(event) {
        offset = document.getElementById("gameDiv").getBoundingClientRect();
        
        mouseX = event.pageX - offset.left;
        mouseY = event.pageY - offset.top;
    },
        

    this.load = function() {
        document.getElementById("progressBar").classList.add("progressBarClass"); 
        // functie apelata pe masura ce resursele sunt incarcate
        function imageLoaded(nLoaded, nTotal) {
            var elem = document.getElementById("progressBar");   
            elem.style.width = (100 * nLoaded / nTotal) + '%'; 
            
            console.log("Au fost incarcate: " + (100 * nLoaded / nTotal) + "% din imagini");
            
            if (nLoaded == nTotal) {
                // apelam init peste 100 de milisecunde, 
                // incat sa se vada ca progress bar-ul se incarcase
                setTimeout(artemis.game.init, 100);
            }
        }
        
        // functie apelata dupa ce sunt parsate xml-urile
        function parseSuccess() {
            artemis.loader.loadResources(imageLoaded);
        }
        
        artemis.loader.parseAll("xml/resurse.xml", 
                                "xml/mesaje.xml", 
                                "xml/setari.xml", 
                                parseSuccess, 
                                function() { console.log("eroare de parsare"); });
                        
    }        

        
    // creaza configuratia initiala
    this.init = function() {
        // ascunde progress bar-ul
        elem = document.getElementById("progressBarParent");
        artemis.domUtils.setVisible(elem, false);
        
        // afiseaza zona de joc
        elem = document.getElementById("gameContainer");
        artemis.domUtils.setVisible(elem, true);
                
        W = document.getElementById("gameDiv").offsetWidth;
        H = document.getElementById("gameDiv").offsetHeight;

        // nivelul
        if (localStorage.getItem("level") == undefined) {
            localStorage.setItem("level", "medium");
        }
        
        if (localStorage.getItem("level") == "beginner") {
            nLives = artemis.loader.getSettings().beginner.nLives;
            nDogs = artemis.loader.getSettings().beginner.nDogs;
        } else if (localStorage.getItem("level") == "medium") {
            nLives = artemis.loader.getSettings().medium.nLives;
            nDogs = artemis.loader.getSettings().medium.nDogs;
        } else if (localStorage.getItem("level") == "advanced") {
            nLives = artemis.loader.getSettings().advanced.nLives;
            nDogs = artemis.loader.getSettings().advanced.nDogs;
        }
        
        // limba
        lang = localStorage.getItem("lang");
        if (lang == undefined) {
            // lang == undefined daca nu s-a intrat inca in pagina cu setari
            lang = "ro";
        }
        
        artemis.loader.setMessageLanguage(lang);
        
        // initializeaza punctele de hrana
        initFoodPoints();
        
        // seteaza pozitiile + destinatiile initiale ale cainilor
        initDogs(artemis.dogSpeed);    
        
        startTime = Date.now();

        intervalScore = setInterval(updateScore, artemis.tScore);
        intervalMove = setInterval(moveDogs, artemis.tMove);
        intervalResize = setInterval(resizeDogs, artemis.tSize);
        intervalFood = setInterval(checkEat, artemis.tCheckEat);
        
        isInitialized = true;
    }


}();
