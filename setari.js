artemis.settingsPage = new function() {


    // accepta siruri de caractere care incep cu o litera
    function validName(name) {
        var re = /[A-Z]\S*/;
        return re.test(name);
    }
    

    // accepta siruri de caractere de tipul string@string.string
    function validEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    

    // cel putin un tip de caine trebuie sa fie selectat
    function validDogTypes() {
        var dogTypes = document.getElementsByName('dogType');
        for (var i = 0; i < dogTypes.length; i++) {
            if (dogTypes[i].checked) {
                return true;
            }
        }
        
        return false;
    }
    

    this.volumeChanged = function(event) {
        audio = artemis.loader.getAudio('latrat').sound;
        audio.volume = event.target.value;
        audio.play();
    }
        

    // preia valorile din local storage si le afiseaza in elementele html
    this.loadFromLocalStorage = function() {
        // nume
        document.getElementById('nameId').value = localStorage.getItem('name');
        
        // email
        document.getElementById('emailId').value = localStorage.getItem('email');
        
        // descriere
        document.getElementById('aboutMeId').value = localStorage.getItem('about');

        // nivel
        var level = localStorage.getItem('level');
        if (level == 'beginner') {
            document.getElementById('beginnerId').checked = 'checked';
        } else if ((level == 'medium')) {
            document.getElementById('mediumId').checked = 'checked';
        } else if ((level == 'advanced')){
            document.getElementById('advancedId').checked = 'checked';
        }        
        
        // tipuri de caini
        var dogTypes = document.getElementsByName('dogType');
        for (var i = 0; i < dogTypes.length; i++) {
            if (localStorage.getItem(dogTypes[i].id) == 'checked') {
                dogTypes[i].checked = true;
            } else {
                dogTypes[i].checked = false;
            }
        }
        
        // volum
        document.getElementById('volumeId').value = localStorage.getItem('volume');
        
        // limba
        document.getElementById('langId').value = localStorage.getItem('lang');
        
        // sunete active
        var sounds = document.getElementsByName('sound');
        for (var i = 0; i < sounds.length; i++) {
            if (localStorage.getItem(sounds[i].id) == 'selected') {
                sounds[i].selected = true;
            } else {
                sounds[i].selected = false;
            }
        }    
    }
    

    // preia valorile din elementele html si le salveaza in local storage
    this.saveToLocalStorage = function() {
        // nume
        localStorage.setItem('name', document.getElementById('nameId').value);
        
        // email
        localStorage.setItem('email', document.getElementById('emailId').value);
        
        // descriere
        localStorage.setItem('about', document.getElementById('aboutMeId').value);

        // nivel
        var level = '';
        if (document.getElementById('beginnerId').checked) {
            level = 'beginner';
        } else if (document.getElementById('mediumId').checked) {
            level = 'medium';
        } else if (document.getElementById('advancedId').checked){
            level = 'advanced';
        }
        localStorage.setItem('level', level);
        
        // tipuri de caini
        var dogTypes = document.getElementsByName('dogType');
        for (var i = 0; i < dogTypes.length; i++) {
            if (dogTypes[i].checked) {
                localStorage.setItem(dogTypes[i].id, 'checked');
            } else {
                localStorage.setItem(dogTypes[i].id, '');
            }
        }
        
        // volum
        localStorage.setItem('volume', document.getElementById('volumeId').value);
        
        // limba
        localStorage.setItem('lang', document.getElementById('langId').value);
        
        // sunete active
        var sounds = document.getElementsByName('sound');
        for (var i = 0; i < sounds.length; i++) {
            if (sounds[i].selected) {
                localStorage.setItem(sounds[i].value, 'selected');
            } else {
                localStorage.setItem(sounds[i].value, '');
            }
        }        
    }
    

    this.addDogCheckboxes = function() {
        // adauga cate un checkbox pentru fiecare tip de caine gasit in xml-ul cu setari
        
        container = document.getElementById('dogTypeContainer');

        dogTypes = artemis.loader.getSettings().dogTypes;        

        
        for (i = 0; i < dogTypes.length; i++) {
            var label = document.createElement('label');

            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "dogType";
            checkbox.checked = "checked";
            checkbox.value = dogTypes[i].name;
            checkbox.id = dogTypes[i].imgId;
            
            var text = document.createTextNode(dogTypes[i].name)
            var br = document.createElement('br');
            
            label.appendChild(checkbox);
            label.appendChild(text);
            
            
            container.appendChild(br);
            container.insertBefore(label, br);
        }
    }
    

    // preia valorile din elementele html si le salveaza in local storage
    this.submit = function(e) {
        e.preventDefault();

        if (!validName(document.getElementById('nameId').value)) {
            alert('Numele trebuie sa inceapa cu o litera mare!');
            return;
        }
        
        if (!validEmail(document.getElementById('emailId').value)) {
            alert('Email-ul introdus nu este valid!');
            return;
        }

        if (!validDogTypes()) {
            alert('Cel putin un tip de caine trebuie sa fie selectat!');
            return;
        }
        alert("Informatiile au fost salvate!");
        
        this.saveToLocalStorage();
    }
    

    this.reset = function(e) {
        if (!confirm("Optiunile selectate vor fi resetate!")) {
            e.preventDefault();
        }   
        else { 
            localStorage.clear(); 
        }        
    }
    

    this.toMenu = function(e) {
        e.preventDefault(); 
        window.location.href = 'meniu.html';
    }
    

    this.init = function() {
        artemis.settingsPage.addDogCheckboxes();
        artemis.settingsPage.loadFromLocalStorage();
    }
    

    this.load = function() {
        // functie apelata dupa ce sunt parsate xml-urile
        function parseSuccess() {
            artemis.settingsPage.init();
        }
        
        artemis.loader.parseAll("xml/resurse.xml", 
                                "xml/mesaje.xml", 
                                "xml/setari.xml", 
                                parseSuccess,
                                function() { console.log("parse error"); });                                
    }


}();
