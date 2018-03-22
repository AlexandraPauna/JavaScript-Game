artemis.loader = new function() {
    var lang;
    
    this.sounds = {};
    this.images = {};
    this.messages = {};
    this.settings = {};
    
    // intoarce obiectul Audio asociat id-ului xml transmis
    this.getAudio = function(id) {
        return this.sounds[id];
    };
    
    
    // intoarce obiectul Image asociat id-ului xml transmis
    this.getImage = function(id) {
        return this.images[id];
    };

    
    // intoarce obiectul cu setari 
    this.getSettings = function() {
        return this.settings;
    };


    // intoarce mesajul corespunzator
    this.getMessage = function(msg) { 
        return this.messages[lang][msg];
    };


    // seteaza limba folosita pentru mesaje
    this.setMessageLanguage = function(language) {
        lang = language;
    }
    


    this.parseResources = function(file, successFunction, errorFunction) {
        // fisierul xml-ul este preluat folosind ajax
        $.ajax({
            url: file,
            type: "GET",
            dataType: "xml",
            success: function(xml) {
                // realizez parsarea (transformarea sirului xml in arbore DOM) - cu jQuery
                $xml = $(xml);

                // caut toate elementele cu tagul "imagine"
                $imgs = $xml.find("imagine");

                $imgs.each(function(i) {
                    id = $(this).attr("id");
                    
                    imgData = new Object();
                    imgData.type = $(this).attr("tip");
                    imgData.src = $(this).text().trim();
                
                    artemis.loader.images[id] = imgData;
                });
                
                // caut toate elementele cu tagul "sunet"
                $sounds = $xml.find("sunet");
                $sounds.each(function(i) {
                    id = $(this).attr("id");

                    soundData = new Object();
                    soundData.src = $(this).text().trim();
                    soundData.sound = new Audio(soundData.src);
                    artemis.loader.sounds[id] = soundData;
                });   
                
                successFunction();
            },
            error: function(err) {
                errorFunction();
            }
        });    
    };
    

    this.parseMessages = function(file, successFunction, errorFunction) {
        $.ajax({
            url: file,
            type: "GET",
            dataType: "xml",
            success: function(xml) {
                // realizeaza parsarea
                $xml = $(xml);
                $langs = $xml.find("mesaje");
                $langs.each(function() {
                    var language = $(this).attr("lang");
                    
                    artemis.loader.messages[language] = {};
                    
                    $msgs = $(this).find("mesaj");
                    $msgs.each(function() {
                        var id = $(this).attr("id");
                        var txt = $(this).text().trim();
                        artemis.loader.messages[language][id] = txt;
                    });
                });                  
                
                successFunction();
            },
            error: function(err) {
                errorFunction();
            }
        });        
    };
    

    this.parseSettings = function(file, successFunction, errorFunction) {
        $.ajax({
            url: file,
            type: "GET",
            dataType: "xml",
            success: function(xml) {
                // realizeaza parsarea
                $xml = $(xml);

                // nivele
                $levels = $xml.find("nivele");
                
                // incepator
                artemis.loader.settings.beginner = {};
                artemis.loader.settings.beginner.nLives = 
                    Number($levels.find("incepator").find("nr_vieti").text());
                artemis.loader.settings.beginner.nDogs = 
                    Number($levels.find("incepator").find("nr_caini").text());
                
                // mediu
                artemis.loader.settings.medium = {};
                artemis.loader.settings.medium.nLives = 
                    Number($levels.find("mediu").find("nr_vieti").text());
                artemis.loader.settings.medium.nDogs = 
                    Number($levels.find("mediu").find("nr_caini").text());
                
                // avansat
                artemis.loader.settings.advanced = {};
                artemis.loader.settings.advanced.nLives = 
                    Number($levels.find("avansat").find("nr_vieti").text());
                artemis.loader.settings.advanced.nDogs = 
                    Number($levels.find("avansat").find("nr_caini").text());
                
                // tipuri de caini
                artemis.loader.settings.dogTypes = [];
                $dogs = $xml.find("caini").find("caine");
                $dogs.each(function() {
                    dogType = new Object();
                    
                    dogType.id = $(this).attr("id");
                    dogType.name = $(this).find("nume").text().trim();
                    dogType.imgId = $(this).find("imagine").text().trim();
                    
                    artemis.loader.settings.dogTypes.push(dogType);
                });
                
                
                successFunction();
            },
            error: function(err) {
                errorFunction();
            }
        });          
    };
    
    
    // incarca resursele si apeleaza progressFunction de
    // fiecare data cand o noua resursa este incarcata
    this.loadResources = function(progressFunction) {
        var nImages = Object.keys(this.images).length;
        var nLoaded = 0;
        
        for (id in this.images) {
            img = new Image();
            img.onload = function() {
                nLoaded++;
                progressFunction(nLoaded, nImages);
            }
            img.src = this.images[id].src;
            this.images[id].img = img;
        }
    }

    
    // parseaza toate cele 3 tipuri de fisiere (resurse, mesaje, setari)
    this.parseAll = function(resourcesFile, messagesFile, settingsFile, success, error) {
        var successCount = 0;
        var successFunction = success;
        
        // functie apelata in momentul in care s-a reusit parsarea unuia din fisiere
        function successOne() {
            successCount++;
            
            // am parsat cu succes toate cele 3 fisiere
            if (successCount == 3) {
                successFunction();
            }
        }
        
        this.parseResources(resourcesFile, successOne, error);
        this.parseMessages(messagesFile, successOne, error);
        this.parseSettings(settingsFile, successOne, error);
    }


}();

