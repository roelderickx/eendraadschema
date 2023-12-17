class Electro_Item extends List_Item {

  //-- Constructor, can be invoked with the List_Item of the parent to know better what kind of
  //   elements are acceptable (e.g. not all parent can have all possible childs) --

  constructor(mylist: Hierarchical_List) {
    super(mylist);
    this.keys.push(["type","SELECT",""]); //0
    this.keys.push(["geaard","BOOLEAN",true]); //1
    this.keys.push(["kinderveiligheid","BOOLEAN",true]); //2
    this.keys.push(["accumulatie","BOOLEAN",false]); //3
    this.keys.push(["aantal","SELECT","1"]); //4
    this.keys.push(["lichtkring_poligheid","SELECT","enkelpolig"]); //5
      //Ook gebruikt voor schakelaar (type schakelaar)
      //Ook gebruikt voor externe sturing Domotica gestuurde verbruiker (type sturing)
    this.keys.push(["ventilator","BOOLEAN",false]); //6
    this.keys.push(["zekering","SELECT","automatisch"]); //7
    this.keys.push(["amperage","STRING","20"]); //8
    this.keys.push(["kabel","STRING","XVB 3G2,5"]); //9
    this.keys.push(["naam","STRING",""]); //10
    this.keys.push(["differentieel_waarde","STRING","300"]); //11
    this.keys.push(["kabel_aanwezig","BOOLEAN",true]); //12, In eerste plaats om aan te geven of er een kabel achter een zekering zit.
    this.keys.push(["aantal2","SELECT","1"]); //13, a.o. gebruikt voor aantal lampen of aantal knoppen op drukknop_armatuur
    this.keys.push(["voltage","STRING","230V/24V"]); //14, a.o. gebruikt voor aantal lampen
    this.keys.push(["commentaar","STRING",""]); //15, extra tekstveld
    this.keys.push(["select1","SELECT","standaard"]); //16, algemeen veld
      //Indien lichtpunt, select1 is het type van licht (standaard, TL, ...)
      //Indien drukknop, select1 kan "standaard", "dimmer" or "rolluik" zijn
      //Indien vrije tekst, select1 kan "verbruiker" of "zonder kader" zijn
      //Indien ketel, type is het soort verwarming
      //Indien stopcontact, select1 is het aantal fasen
    this.keys.push(["select2","SELECT","standaard"]); //17, algemeen veld
      //Indien lichtpunt, select2 is de selector voor het type noodverlichting (indien aanwezig)
      //Indien vrije tekst of verbruiker, kan "links", "centreer", "rechts" zijn
      //Indien differentieel of differentieelautomaat (in kring of aansluiting), kan type "", "A", of "B" zijn
      //Indien automaat (in kring of aansluiting), kan curve "", "A", "B", of "C" zijn
    this.keys.push(["select3","SELECT","standaard"]); //18, algemeen veld
      //Indien differentieelautomaat (in kring of aansluiting), kan curve "", "A", "B", of "C" zijn.  Veld 17 is dan het Type.
      //Indien vrije tekst kan je hier kiezen tussen automatisch of handmatige breedte
    this.keys.push(["bool1","BOOLEAN",false]); //19, algemeen veld
      //Indien lichtpunt, bool1 is de selector voor wandverlichting of niet
      //Indien drukknop, bool1 is de selector voor afgeschermd of niet
      //Indien schakelaar/lichtcircuit, bool1 is de selector voor signalisatielamp of niet
      //Indien vrije tekst of verbruiker, bool1 is de selector voor vet
      //Indien stopcontact, bool1 is de selector voor ingebouwde schakelaar
      //Indien domotica gestuurde verbruiker, bool1 is de selector voor draadloos
    this.keys.push(["bool2","BOOLEAN",false]); //20, algemeen veld
      //Indien lichtpunt, schakelaar, drukknop of stopcontact, bool2 is de selector voor halfwaterdicht of niet
      //Indien vrije tekst of verbruiker, bool2 is de selector voor schuin
      //Indien ketel, bool2 is de selector voor energiebron
      //Indien kring, bool2 is de selector voor selectieve differentieel
      //Indien stopcontact, bool2 is de selector voor halfwaterdicht
      //Indien domotica gestuurde verbruiker, bool2 is de selector voor drukknop
    this.keys.push(["bool3","BOOLEAN",false]); //21, algemeen veld
      //Indien lichtpunt, bool3 is de selector voor ingebouwde schakelaar of niet
      //Indien schakelaar of drukknop, bool3 is de selector voor verklikkerlamp of niet
      //Indien ******, bool3 is de selector voor warmtefunctie
      //Indien stopcontact, bool3 is de selector voor meerfasig
      //Indien domotica gestuurde verbruiker, bool3 is de selector voor geprogrammeerd
    this.keys.push(["string1","STRING",""]); //22, algemeen veld
      //Indien vrije tekst of verbruiker, breedte van het veld
      //Indien vrije ruimte, breede van de ruimte
    this.keys.push(["string2","STRING",""]); //23, algemeen veld
      //Indien vrije tekst of verbruiker, het adres-veld (want reeds gebruikt voor de tekst zelf)
      //Indien aansluiting, hier kan ook een extra naam voor de aansluiting staan
    this.keys.push(["string3","STRING",""]); //24, algemeen veld
    this.keys.push(["bool4","BOOLEAN",false]); //25, algemeen veld
      //Indien schakelaar, indicatie trekschakelaar of niet
      //Indien stopcontact, bool4 is de selector voor nulgeleider of niet
      //Indien domotica gestuurde verbruiker, bool4 is de selector voor detectie
    this.keys.push(["bool5","BOOLEAN",false]); //26, algemeen veld
      //Indien domotica gestuurde verbruiker, bool5 is de selector voor uitbreiding van de sturing met drukknop
      //Indien stopcontact, geeft aan dat deze in een verdeelbord zit

    this.updateConsumers();
  }

  //-- When called, this one ensures we cannot have a child that doesn't align with its parent --

  getConsumers() {
    var Parent = this.getParent();

    var consumers = [];
    if (Parent == null) {
      consumers = ["", "Kring", "Aansluiting"];
    } else {
      switch (Parent.getKey("type")) {
        case "Bord": {
          consumers = ["", "Kring", "Vrije ruimte"];
          break;
        }
        case "Splitsing":
        case "Domotica": {
          consumers = ["", "Kring"];
          break;
        }
        case "Kring": {
          consumers = ["", "Aansluiting", "Bord", "Domotica", "Domotica gestuurde verbruiker", "Kring", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
          break;
        }
        case "Meerdere verbruikers": {
          consumers = ["", "Domotica", "Domotica gestuurde verbruiker", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Omvormer", "Overspanningsbeveiliging", "Microgolfoven", "Motor", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
          break;
        }
        case "Domotica gestuurde verbruiker": {
          consumers = ["", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
          break;
        }
        case "Aansluiting": {
          consumers = ["", "Bord", "Kring", "Splitsing"];
          break;
        }
        default: {
          consumers = ["", "Aansluiting", "Domotica", "Domotica gestuurde verbruiker", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
          break;
        }
      }
    }

    return consumers;
  }

  //-- Make the current item a copy of source_item --

  clone(source_item: List_Item) {
    this.parent = source_item.parent;
    this.indent = source_item.indent;
    this.collapsed = source_item.collapsed;
    this.sourcelist = source_item.sourcelist;
    
    for (var i = 0; i<this.keys.length; i++) {
      for (var j=0; j<3; j++) {
        this.keys[i][j] = source_item.keys[i][j];
      }
    }
  }

  //-- Clear all keys --

  clearKeys() {
    //Whipe most keys; note how we don't reset keys[10][2] as usually we don't want the number to change
    for (let i = 1; i < 10; i++) this.keys[i][2] = "";
    for (let i = 11; i < this.keys.length; i++) this.keys[i][2] = "";  
  }

  //-- When a new element is created, we will call resetKeys to set the keys to their default values --

  resetKeys() {
    this.keys[1][2] = true;
    this.keys[2][2] = true;
    this.keys[3][2] = false;
    this.keys[5][2] = "enkelpolig";
    this.keys[6][2] = false;

    if (this.keys[0][2] == "Aansluiting") {
      this.keys[4][2] = "2";
      this.keys[7][2] = "differentieel";
      this.keys[8][2] = "40";
      this.keys[9][2] = "2x16";
      this.keys[17][2] = "";
    } else {
      this.keys[4][2] = "1";
      this.keys[7][2] = "automatisch";
      this.keys[8][2] = "20";
      this.keys[9][2] = "XVB 3G2,5";
    };


    this.keys[11][2] = "300"; //Differentieel

    let parent = this.getParent();
    if (parent == null) {
      this.keys[12][2] = true;
    } else {
      switch (parent.getKey("type")) { //Kabel_aanwezig
        case "Splitsing":
          this.keys[7][2] = "geen"; //geen zekering per default na splitsing
          this.keys[12][2] = false; //geen kabel per default na splitsing
          break;
        case "Domotica":
          this.keys[7][2] = "geen"; //geen zekering per default na domotica
          break;
        default:
          this.keys[7][2] = "automatisch"; //wel een zekering na bord
          this.keys[12][2] = true; //wel een kabel na bord
          break;
      }
    };

    if (this.keys[0][2] == "Schakelaars") {this.keys[25][2] = false; }

    this.keys[13][2] = "1";
    this.keys[14][2] = "230V/24V";
    this.keys[15][2] = "";

    //-- Set each of the optional booleans to false --
    this.keys[19][2] = false;
    this.keys[20][2] = false;
    this.keys[21][2] = false;
    this.keys[25][2] = false;
    this.keys[26][2] = false;

    //-- Empty the strings
    this.keys[22][2] = "";
    this.keys[23][2] = "";
    this.keys[24][2] = "";

    switch (this.keys[0][2]) { //Special cases
      case "Kring":
        this.keys[4][2] = 2;
        this.keys[10][2] = "---";
        this.keys[16][2] = "N/A";
        this.keys[17][2] = "";
        this.keys[18][2] = "";
        break;
      case "Aansluiting":
        this.keys[23][2] = "";
      case "Stopcontact":
        this.keys[16][2] = "3";
        break;
      case "Splitsing":
        //this.keys[10][2] = "";
        break;
      case "Domotica":
        this.keys[15][2] = "Domotica";
        break;
      case "Domotica gestuurde verbruiker":
        this.keys[19][2] = true;
        this.keys[20][2] = true;
        this.keys[21][2] = true;
      case "Lichtpunt":
        this.keys[17][2] = "Geen"; //Geen noodverlichting
        break;
      case "Verlenging":
        this.keys[22][2] = 40;
        break;      
      case "Vrije ruimte":
        this.keys[22][2] = 25;
        break;
      case "Vrije tekst":
        this.keys[22][2] = 40;
        this.keys[17][2] = "centreer";
        break;    
      case "Zeldzame symbolen":
        this.keys[16][2] = "";
        break;
      case "Warmtepomp/airco":
        this.keys[18][2] = "Koelend";
        break;
      default:
        //this.keys[10][2] = "";
        break;
    };
  }

  //-- Algorithm to manually set a key, but most of the time, the keys-array is updated directly
  //   Note that getKey is defined in List_Item --

  setKey(key: string, setvalue: any) {
    super.setKey(key, setvalue);
    //If type of component changed, reset everything
    if (key=="type") {
      this.resetKeys();
    }
    //Some validation on the input. Do properties still make sense after update
    switch (this.keys[0][2]) {
      case "Lichtcircuit":
        if (this.getKey("lichtkring_poligheid") == "dubbelpolig") {
          if ((this.getKey("aantal") as number) > 2) {
            this.setKey("aantal","2");
          }
        }
        break;
      case "Verwarmingstoestel":
        if ( (this.getKey("accumulatie") == false) && (this.getKey("ventilator") == true) ) {
          this.setKey("ventilator",false);
        }
        break;
      case "Kring":
        if ( ( (this.getKey("aantal") as number) < 1 ) || ( (this.getKey("aantal") as number) > 4 ) ) {
          this.setKey("aantal","2");
        }
        break;
    }
  }

  //-- Returns true if the Electro_Item can have childs in case it is or
  //   will become a child of Parent --

  checkInsertChild(Parent?: List_Item) { //Checks if the insert after button should be displayed or not
    var allow = false;
    switch (this.keys[0][2]) {
      case "Aansluiting":
      case "Bord":
      case "Kring":
      case "Domotica":
      case "Domotica gestuurde verbruiker":
      case "Splitsing":
        allow = true;
        break;
      case "Bel":
      case "Lichtcircuit":
        allow = false;
        break;
      default:
        if (typeof Parent == 'undefined') {
          allow = true;
        } else {
          switch(Parent.keys[0][2]) {
            case "Aansluiting":
            case "Bord":
            case "Domotica":
            case "Splitsing":
            case "Meerdere verbruikers":
              allow = false;
              break;
            default:
              allow = true;
              break;
          }
        }
    }
    return(allow);
  }

  //-- returns the maximum number of childs the current Electro_Item can have in case
  //   it is or will become a child of Parent --

  getMaxNumChilds(Parent?: List_Item) {
    var maxchilds = 0;
    switch (this.keys[0][2]) {
      case "Aansluiting":
      case "Bord":
      case "Kring":
      case "Domotica":
      case "Splitsing":
      case "Meerdere verbruikers":
        maxchilds = 256;
        break;  

      case "Domotica gestuurde verbruiker":
        maxchilds = 1;
        break;  
      
      case "Bel": 
      case "Lichtcircuit":
      case "Vrije ruimte":
        maxchilds = 0;
        break;

      default:
        if (typeof Parent == 'undefined') {
          maxchilds = 256;
        } else {
          switch(Parent.keys[0][2]) {
            case "Aansluiting":
            case "Bord":
            case "Domotica":
            case "Splitsing":
            case "Meerdere verbruikers":
              maxchilds = 0;
              break;
            default:
              maxchilds = 1;
              break;
          }
        }
    }
    return(maxchilds);
  }

  //-- Checks if the insert after button should be displayed or not in case the
  //   element is or will become a child of Parent --

  checkInsertAfter(Parent?: List_Item) {
    var allow = false;
    if (typeof Parent == 'undefined') {
      allow = true;
    } else {
      //alert(Parent.keys[0][2]);
      switch(Parent.keys[0][2]) {
        case "Aansluiting":
        case "Bord":
        case "Kring":
        case "Domotica":
        case "Splitsing":
        case "Meerdere verbruikers":
          allow = true;
          break;
        default:
          allow = false;
          break;
      }
    }
    return(allow);
  }

  toHTMLHeader(mode: string, Parent?: List_Item) {
    let output:string = "";

    if (mode=="move") {
      output += "<b>ID: "+this.id+"</b>, ";
      output += 'Moeder: <input id="id_parent_change_' + this.id + '" type="text" size="2" value="' + this.parent + '" onchange="HL_changeparent(' + this.id + ')"> ';
      output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveUp(" + this.id +")\">&#9650;</button>";
      output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveDown(" + this.id +")\">&#9660;</button>";
      if (this.checkInsertAfter(Parent)) {
        output += " <button style=\"background-color:lightblue;\" onclick=\"HLClone(" + this.id +")\">Clone</button>";
      }
    } else {
      if (this.checkInsertAfter(Parent)) {
        output += " <button style=\"background-color:green;\" onclick=\"HLInsertBefore(" + this.id +")\">&#9650;</button>";
        output += " <button style=\"background-color:green;\" onclick=\"HLInsertAfter(" + this.id +")\">&#9660;</button>";
      }
      if (this.checkInsertChild(Parent)) {
        output += " <button style=\"background-color:green;\" onclick=\"HLInsertChild(" + this.id +")\">&#9654;</button>";
      }
    };
    output += " <button style=\"background-color:red;\" onclick=\"HLDelete(" + this.id +")\">&#9851;</button>";
    output += "&nbsp;"

    output += this.selectToHTML(0, this.getConsumers());

    return(output);
  }

  //-- Display the element in the editing grid at the left of the screen in case the
  //   element is or will become a child of Parent --

  toHTML(mode: string, Parent?: List_Item) {
    let output = this.toHTMLHeader(mode, Parent);

    switch (this.keys[0][2]) {
      case "Kring":
        output += "&nbsp;Naam: " + this.stringToHTML(10,5) + "<br>";
        output += "Zekering: " + this.selectToHTML(7,["automatisch","differentieel","differentieelautomaat","smelt","geen","---","schakelaar","relais","schemer","overspanningsbeveiliging"]);
        if ( (this.keys[7][2] != "geen") && (this.keys[7][2] != "relais") ) output += this.selectToHTML(4,["2","3","4","-","1"]) + this.stringToHTML(8,2) + "A";
        if (this.getKey("zekering")=="differentieel") {
          output += ", \u0394 " + this.stringToHTML(11,3) + "mA";
          output += ", Type:" + this.selectToHTML(17,["","A","B"]);
          output += ", Kortsluitvermogen: " + this.stringToHTML(22,3) + "kA";
          output += ", Selectief: " + this.checkboxToHTML(20);
        }
        if (this.getKey("zekering")=="automatisch") {
          output += ", Curve:" + this.selectToHTML(17,["","B","C","D"]);
          output += ", Kortsluitvermogen: " + this.stringToHTML(22,3) + "kA";
        }
        if (this.getKey("zekering")=="differentieelautomaat") {
          output += ", \u0394 " + this.stringToHTML(11,3) + "mA";
          output += ", Curve:" + this.selectToHTML(18,["","B","C","D"]);
          output += ", Type:" + this.selectToHTML(17,["","A","B"]);
          output += ", Kortsluitvermogen: " + this.stringToHTML(22,3) + "kA";
          output += ", Selectief: " + this.checkboxToHTML(20);
        }
        if (this.getKey("zekering")=="relais") {
        }
        output += ", Kabel: " + this.checkboxToHTML(12);
        if (this.getKey("kabel_aanwezig")) {
          output += ", Type: " + this.stringToHTML(9,10);
          output += ", Plaatsing: " + this.selectToHTML(16,["N/A","Ondergronds","Luchtleiding","In wand","Op wand"]);
          if (this.keys[16][2] != "Luchtleiding") {
            output += ", In buis: " + this.checkboxToHTML(19);
          }
        }
        output += ", Tekst: " + this.stringToHTML(15,10);
        break;
      case "Aansluiting":
        output += "&nbsp;Naam: " + this.stringToHTML(23,5) + "<br>";
        if (typeof Parent != 'undefined') output += "Nr: " + this.stringToHTML(10,5) + ", ";
        output += "Zekering: " + this.selectToHTML(7,["automatisch","differentieel","differentieelautomaat","smelt","geen","---","schakelaar","schemer"]) +
                                       this.selectToHTML(4,["2","3","4"]) +
                                       this.stringToHTML(8,2) + "A";
        if (this.getKey("zekering")=="differentieel") {
          output += ", \u0394 " + this.stringToHTML(11,3) + "mA";
          output += ", Type:" + this.selectToHTML(17,["","A","B"]);
          output += ", Kortsluitvermogen: " + this.stringToHTML(22,3) + "kA";
          output += ", Selectief: " + this.checkboxToHTML(20);
        }
        if (this.getKey("zekering")=="differentieelautomaat") {
          output += ", \u0394 " + this.stringToHTML(11,3) + "mA";
          output += ", Curve:" + this.selectToHTML(18,["","B","C","D"]);
          output += ", Type:" + this.selectToHTML(17,["","A","B"]);
          output += ", Kortsluitvermogen: " + this.stringToHTML(22,3) + "kA";
          output += ", Selectief: " + this.checkboxToHTML(20);
        }
        if (this.getKey("zekering")=="automatisch") {
          output += ", Curve:" + this.selectToHTML(17,["","B","C","D"]);
          output += ", Kortsluitvermogen: " + this.stringToHTML(22,3) + "kA";
        }
        output += ", Kabeltype na teller: " + this.stringToHTML(9,10);
        output += ", Kabeltype v&oacute;&oacute;r teller: " + this.stringToHTML(24,10);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Bord":
        output += "&nbsp;Naam: " + this.stringToHTML(10,5) + ", ";
        output += "Geaard: " + this.checkboxToHTML(1);
        break;
      case "Lichtpunt":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5) + ", ";
        output += "Type: " + this.selectToHTML(16,["standaard", "TL", "spot", "led" /*, "Spot", "Led", "Signalisatielamp" */]) + ", ";
        if (this.keys[16][2] == "TL") {
          output += "Aantal buizen: " + this.selectToHTML(13,["1","2","3","4"]) + ", ";
        }
        output += "Aantal lampen: " + this.selectToHTML(4,["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"]) + ", ";
        output += "Wandlamp: " + this.checkboxToHTML(19) + ", ";
        output += "Halfwaterdicht: " + this.checkboxToHTML(20) + ", ";
        output += "Ingebouwde schakelaar: " + this.checkboxToHTML(21) + ", ";
        output += "Noodverlichting: " + this.selectToHTML(17,["Geen", "Centraal", "Decentraal"]);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Lichtcircuit":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", " + this.selectToHTML(5,["enkelpolig", "dubbelpolig", "driepolig", "dubbelaansteking", "---", "schakelaar", "dimschakelaar", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat"]);
        output += ", Halfwaterdicht: " + this.checkboxToHTML(20);
        if ( (this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "driepolig") || (this.keys[5][2] == "kruis_enkel") ||
             (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "dubbel") ||
             (this.keys[5][2] == "dimschakelaar") ) {
          output += ", Verklikkerlampje: " + this.checkboxToHTML(21);
          output += ", Signalisatielampje: " + this.checkboxToHTML(19);
          if (this.keys[5][2] != "dimschakelaar") {output += ", Trekschakelaar: " + this.checkboxToHTML(25); }
        }
        switch (this.getKey("lichtkring_poligheid")) {
          case "enkelpolig":
            output += ", Aantal schakelaars: " + this.selectToHTML(4,["0","1","2","3","4","5"]);
            break;
          case "dubbelpolig":
            output += ", Aantal schakelaars: " + this.selectToHTML(4,["0","1","2"]);
            break;
        }
        output += ", Aantal lichtpunten: " + this.selectToHTML(13,["0","1","2","3","4","5","6","7","8","9","10"]);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Schakelaars":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", " + this.selectToHTML(5,["enkelpolig", "dubbelpolig", "driepolig", "dubbelaansteking", "wissel_enkel", "wissel_dubbel", "kruis_enkel", "---", "schakelaar", "dimschakelaar", "dimschakelaar wissel", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat", "rolluikschakelaar"]);
        if ( (this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "driepolig") || (this.keys[5][2] == "kruis_enkel") ||
             (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "wissel_dubbel") || (this.keys[5][2] == "dubbel") ||
             (this.keys[5][2] == "dimschakelaar") || (this.keys[5][2] == "dimschakelaar wissel") || (this.keys[5][2] == "rolluikschakelaar") ) {
          output += ", Halfwaterdicht: " + this.checkboxToHTML(20);
        }
        if ( (this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "driepolig") || (this.keys[5][2] == "kruis_enkel") ||
             (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "wissel_dubbel") || (this.keys[5][2] == "dubbel") ||
             (this.keys[5][2] == "dimschakelaar") || (this.keys[5][2] == "dimschakelaar wissel") ) {
          output += ", Verklikkerlampje: " + this.checkboxToHTML(21);
          output += ", Signalisatielampje: " + this.checkboxToHTML(19);
          if ( (this.keys[5][2] != "dimschakelaar") && (this.keys[5][2] != "dimschakelaar wissel") ) {output += ", Trekschakelaar: " + this.checkboxToHTML(25); }
        }
        switch (this.getKey("lichtkring_poligheid")) {
          case "enkelpolig":
            output += ", Aantal schakelaars: " + this.selectToHTML(4,["1","2","3","4","5"]);
            break;
          case "dubbelpolig":
            output += ", Aantal schakelaars: " + this.selectToHTML(4,["1","2"]);
            break;
        }
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Domotica":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Tekst: " + this.stringToHTML(15,10);
        break;
      case "Domotica gestuurde verbruiker":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Draadloos: " + this.checkboxToHTML(19);  
        output += ", Lokale Drukknop: " + this.checkboxToHTML(20);  
        output += ", Geprogrammeerd: " + this.checkboxToHTML(21);  
        output += ", Detectie: " + this.checkboxToHTML(25);
        output += ", Externe sturing: " + this.checkboxToHTML(26);    
        if (this.keys[26][2]) {
          output += ", Externe sturing: " + this.selectToHTML(5,["drukknop","schakelaar"]);    
        }
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
      case "Splitsing":
        break;
      case "Vrije ruimte":
          output += "&nbsp;Breedte: " + this.stringToHTML(22,3);
          break;  
      case "Meerdere vebruikers":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      default:
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
    }
    //output += "id: " + this.id + " parent: " + this.parent;
    return(output);
  }

  //-- Generates SVG code for switches --

  toSVGswitches(hasChild: Boolean, mySVG: SVGelement) {
    let outputstr:string = "";
    var elements:Array<string> = new Array<string>();
    var halfwaterdicht:Array<boolean> = new Array<boolean>();
    var verklikkerlamp:Array<boolean> = new Array<boolean>();
    var signalisatielamp:Array<boolean> = new Array<boolean>();
    var trekschakelaar:Array<boolean> = new Array<boolean>();

    var lowerbound = 20; // How low does the switch go below the baseline, needed to place adres afterwards

    switch (this.getKey("lichtkring_poligheid")) {
      case "wissel_enkel":
        elements.push("wissel_enkel");
        signalisatielamp.push(this.keys[19][2]);
        halfwaterdicht.push(this.keys[20][2]);
        verklikkerlamp.push(this.keys[21][2]);
        trekschakelaar.push(this.keys[25][2]);
        break;
      case "wissel_dubbel":
        elements.push("wissel_dubbel");
        signalisatielamp.push(this.keys[19][2]);
        halfwaterdicht.push(this.keys[20][2]);
        verklikkerlamp.push(this.keys[21][2]);
        trekschakelaar.push(this.keys[25][2]);
        break;
      case "kruis_enkel":
        elements.push("kruis_enkel");
        signalisatielamp.push(this.keys[19][2]);
        halfwaterdicht.push(this.keys[20][2]);
        verklikkerlamp.push(this.keys[21][2]);
        trekschakelaar.push(this.keys[25][2]);
        break;
      case "teleruptor":
        elements.push("teleruptor");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "bewegingsschakelaar":
        elements.push("bewegingsschakelaar");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "schemerschakelaar":
        elements.push("schemerschakelaar");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "schakelaar":
        elements.push("schakelaar");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "dimmer":
        elements.push("dimmer");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "relais":
        elements.push("relais");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "minuterie":
        elements.push("minuterie");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "thermostaat":
        elements.push("thermostaat");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "tijdschakelaar":
        elements.push("tijdschakelaar");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "rolluikschakelaar":
        elements.push("rolluik");
        signalisatielamp.push(false);
        halfwaterdicht.push(this.keys[20][2]);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "dubbelaansteking":
        elements.push("dubbelaansteking");
        signalisatielamp.push(this.keys[19][2]);
        halfwaterdicht.push(this.keys[20][2]);
        verklikkerlamp.push(this.keys[21][2]);
        trekschakelaar.push(this.keys[25][2]);
        break;
      case "dimschakelaar":
        elements.push("dimschakelaar");
        signalisatielamp.push(this.keys[19][2]);
        halfwaterdicht.push(this.keys[20][2]);
        verklikkerlamp.push(this.keys[25][2]);
        trekschakelaar.push(false);
        break;
      case "dimschakelaar wissel":
        elements.push("dimschakelaar wissel");
        signalisatielamp.push(this.keys[19][2]);
        halfwaterdicht.push(this.keys[20][2]);
        verklikkerlamp.push(this.keys[25][2]);
        trekschakelaar.push(false);
        break;
      default: {
        if (this.getKey("aantal") == "0") {
          //do nothing
        } else if (this.getKey("aantal") == "1") {
          if (this.getKey("lichtkring_poligheid") == "enkelpolig") {
            elements.push("enkel");
          } else if (this.getKey("lichtkring_poligheid") == "dubbelpolig") {
            elements.push("dubbel");
          } else if (this.getKey("lichtkring_poligheid") == "driepolig") {
            elements.push("driepolig");
          }
          signalisatielamp.push(this.keys[19][2]);
          halfwaterdicht.push(this.keys[20][2]);
          verklikkerlamp.push(this.keys[21][2]);
          trekschakelaar.push(this.keys[25][2]);
        } else {
          if (this.getKey("lichtkring_poligheid") == "enkelpolig") {
            elements.push("wissel_enkel");
            signalisatielamp.push(this.keys[19][2]);
            halfwaterdicht.push(this.keys[20][2]);
            verklikkerlamp.push(this.keys[21][2]);
            trekschakelaar.push(this.keys[25][2]);
            for (var i=2; i<this.getKey("aantal"); i++) {
              elements.push("kruis_enkel");
              signalisatielamp.push(this.keys[19][2]);
              halfwaterdicht.push(this.keys[20][2]);
              verklikkerlamp.push(this.keys[21][2]);
              trekschakelaar.push(this.keys[25][2]);
            }
            elements.push("wissel_enkel");
            signalisatielamp.push(this.keys[19][2]);
            halfwaterdicht.push(this.keys[20][2]);
            verklikkerlamp.push(this.keys[21][2]);
            trekschakelaar.push(this.keys[25][2]);
          } else if (this.getKey("lichtkring_poligheid") == "dubbelpolig") {
            elements.push("wissel_dubbel");
            signalisatielamp.push(this.keys[19][2]);
            halfwaterdicht.push(this.keys[20][2]);
            verklikkerlamp.push(this.keys[21][2]);
            trekschakelaar.push(this.keys[25][2]);
            elements.push("wissel_dubbel");
            signalisatielamp.push(this.keys[19][2]);
            halfwaterdicht.push(this.keys[20][2]);
            verklikkerlamp.push(this.keys[21][2]);
            trekschakelaar.push(this.keys[25][2]);
          }
        }
      }
    }

    if (this.getKey("aantal2")>=1) {
      elements.push("lamp");
      signalisatielamp.push(this.keys[19][2]);
      halfwaterdicht.push(this.keys[20][2]);
      verklikkerlamp.push(this.keys[21][2]);
    }

    var startx = 1;
    var endx = 0;

    for (i=0; i<elements.length; i++ ) {
      switch (elements[i]) {
        case "enkel":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_enkel" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
          if (verklikkerlamp[i]) outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />';
          if (trekschakelaar[i]) outputstr += '<line x1="' + (endx+10.5) + '" x2="' + (endx+10.5) + '" y1="5" y2="15" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+8.5) + '" y1="15" y2="11" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+12.5) + '" y1="15" y2="11" stroke="black" />';
          if ((i==elements.length-1) && (!hasChild)) { endx += 10; }
          startx = endx+5;
          break;
        case "dubbel":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_dubbel" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          if (verklikkerlamp[i]) { outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />'; };
          if (trekschakelaar[i]) outputstr += '<line x1="' + (endx+8.5) + '" x2="' + (endx+8.5) + '" y1="9" y2="19" stroke="black" /><line x1="' + (endx+8.5) + '" x2="' + (endx+6.5) + '" y1="19" y2="15" stroke="black" /><line x1="' + (endx+8.5) + '" x2="' + (endx+10.5) + '" y1="19" y2="15" stroke="black" />';
          if ((i==elements.length-1) && (!hasChild)) { endx += 10; }
          startx = endx+5;
          break;
        case "driepolig":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_trippel" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          if (verklikkerlamp[i]) { outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />'; };
          if (trekschakelaar[i]) outputstr += '<line x1="' + (endx+8.5) + '" x2="' + (endx+8.5) + '" y1="9" y2="19" stroke="black" /><line x1="' + (endx+8.5) + '" x2="' + (endx+6.5) + '" y1="19" y2="15" stroke="black" /><line x1="' + (endx+8.5) + '" x2="' + (endx+10.5) + '" y1="19" y2="15" stroke="black" />';
          if ((i==elements.length-1) && (!hasChild)) { endx += 10; }
          startx = endx+5;
          break;
        case "dubbelaansteking":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_dubbelaansteking" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          if (verklikkerlamp[i]) { outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />'; };
          if (trekschakelaar[i]) outputstr += '<line x1="' + (endx+10.5) + '" x2="' + (endx+10.5) + '" y1="5" y2="15" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+8.5) + '" y1="15" y2="11" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+12.5) + '" y1="15" y2="11" stroke="black" />';
          if ((i==elements.length-1) && (!hasChild)) { endx += 10; }
          startx = endx+5;
          break;
        case "wissel_enkel":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_wissel_enkel" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          if (verklikkerlamp[i]) { outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />'; };
          if (trekschakelaar[i]) outputstr += '<line x1="' + (endx+10.5) + '" x2="' + (endx+10.5) + '" y1="5" y2="15" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+8.5) + '" y1="15" y2="11" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+12.5) + '" y1="15" y2="11" stroke="black" />';
          if ((i==elements.length-1) && (!hasChild)) { endx += 10; }
          startx = endx+5;
          lowerbound = Math.max(lowerbound,35);
          break;
        case "wissel_dubbel":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_wissel_dubbel" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          if (verklikkerlamp[i]) { outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />'; };
          if (trekschakelaar[i]) outputstr += '<line x1="' + (endx+8.5) + '" x2="' + (endx+8.5) + '" y1="9" y2="19" stroke="black" /><line x1="' + (endx+8.5) + '" x2="' + (endx+6.5) + '" y1="19" y2="15" stroke="black" /><line x1="' + (endx+8.5) + '" x2="' + (endx+10.5) + '" y1="19" y2="15" stroke="black" />';
          if ((i==elements.length-1) && (!hasChild)) { endx += 10; }
          startx = endx+5;
          lowerbound = Math.max(lowerbound,35);
          break;
        case "kruis_enkel":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_kruis_enkel" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          if (verklikkerlamp[i]) { outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />'; };
          if (trekschakelaar[i]) outputstr += '<line x1="' + (endx+10.5) + '" x2="' + (endx+10.5) + '" y1="5" y2="15" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+8.5) + '" y1="15" y2="11" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+12.5) + '" y1="15" y2="11" stroke="black" />';
          if ((i==elements.length-1) && (!hasChild)) { endx += 10; }
          startx = endx+5;
          lowerbound = Math.max(lowerbound,35);
          break;
        case "dimschakelaar":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_enkel_dim" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          if (verklikkerlamp[i]) { outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />'; };
          if ((i==elements.length-1) && (!hasChild)) { endx += 10; }
          startx = endx+5;
          break;
        case "dimschakelaar wissel":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_wissel_dim" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          if (verklikkerlamp[i]) { outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />'; };
          if ((i==elements.length-1) && (!hasChild)) { endx += 10; }
          startx = endx+5;
          lowerbound = Math.max(lowerbound,35);
          break;
        case "bewegingsschakelaar":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#relais" x="' + endx + '" y="16" />';
          outputstr += '<use xlink:href="#moving_man" x="' + (endx + 1.5) + '" y="11" />';
          outputstr += '<use xlink:href="#detectie_klein" x="' + (endx + 23) +'" y="13"></use>';
          outputstr += '<line x1="' + endx + '" x2="' + endx + '" y1="29" y2="43" fill="none" style="stroke:black" />';
          outputstr += '<line x1="' + (endx+40) + '" x2="' + (endx+40) + '" y1="29" y2="43" fill="none" style="stroke:black" />';
          outputstr += '<line x1="' + (endx) + '" x2="' + (endx+40) + '" y1="43" y2="43" fill="none" style="stroke:black" />';
          startx = endx + 40;
          lowerbound = Math.max(lowerbound,30);
          break;
        case "schakelaar":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar" x="' + endx + '" y="25" />';
          startx = endx + 40;
          break;
        case "schemerschakelaar":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schemerschakelaar" x="' + endx + '" y="25" />';
          startx = endx + 40;
          break;
        case "teleruptor":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#teleruptor" x="' + endx + '" y="25" />';
          startx = endx + 40;
          lowerbound = Math.max(lowerbound,30);
          break;
        case "dimmer":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#dimmer" x="' + endx + '" y="25" />';
          startx = endx + 40;
          lowerbound = Math.max(lowerbound,30);
          break;
        case "relais":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#relais" x="' + endx + '" y="25" />';
          startx = endx + 40;
          lowerbound = Math.max(lowerbound,30);
          break;
        case "minuterie":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#minuterie" x="' + endx + '" y="25" />';
          startx = endx + 40;
          lowerbound = Math.max(lowerbound,30);
          break;
        case "thermostaat":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#thermostaat" x="' + endx + '" y="25" />';
          startx = endx + 40;
          lowerbound = Math.max(lowerbound,30);
          break;
        case "tijdschakelaar":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#tijdschakelaar" x="' + endx + '" y="25" />';
          startx = endx + 40;
          lowerbound = Math.max(lowerbound,30);
          break;
        case "rolluik":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_rolluik" x="' + endx + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          startx = endx + 8;
          lowerbound = Math.max(lowerbound,25);
          break;
        case "lamp":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#lamp" x="' + endx + '" y="25" />';

          var print_str_upper = "";
          if (this.keys[20][2]) {
            print_str_upper = "h";
            if (parseInt(this.keys[13][2]) > 1) { // Meer dan 1 lamp
              print_str_upper += ", x" + this.keys[13][2];
            }
          } else if (parseInt(this.keys[13][2]) > 1) {
            print_str_upper = "x" + this.keys[13][2];
          }

          //if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }

          if (print_str_upper != "") {
            outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(print_str_upper) + '</text>';
          }

          if ( (i<elements.length-1) || ((i==elements.length-1) && (hasChild)) ) {
            outputstr += '<line x1="'+endx+'" y1="25" x2="'+(endx+10)+'" y2="25" stroke="black" />';
          }

          startx = endx + 10;
          lowerbound = Math.max(lowerbound,29);
          break;
      }
    }

    endx = startx-2;
    mySVG.xright = endx;

    //Place adress underneath
    outputstr += this.addAddress(mySVG,25+lowerbound,Math.max(0,lowerbound-20));
    return(outputstr);
  }

  //-- Add the addressline below --

  addAddress(mySVG: SVGelement, starty:number = 60, godown:number = 15, shiftx:number = 0, key:number=15): String {
    let returnstr:string = "";
    if (!(/^\s*$/.test(this.keys[key][2]))) { //check if adres contains only white space
      returnstr = '<text x="' + ((mySVG.xright-20)/2 + 21 + shiftx) + '" y="' + starty + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[key][2]) + '</text>';
      mySVG.ydown = mySVG.ydown + godown;
    }
    return returnstr;
  }

  //-- Make the SVG for the entire electro item --

  toSVG(hasChild: Boolean = false) {
    let mySVG:SVGelement = new SVGelement();
    let outputstr:string = "";

    mySVG.data = "";
    mySVG.xleft = 1; // foresee at least some space for the conductor
    mySVG.xright = 20;
    mySVG.yup = 25;
    mySVG.ydown = 25;

    switch (this.keys[0][2]) {
      case "Leeg":
      case "Lichtcircuit":
        outputstr += this.toSVGswitches(hasChild, mySVG);
        break;
      case "Lichtpunt":
        outputstr += '<line x1="0" x2="30" y1="25" y2="25" stroke="black" />';
        var print_str_upper = "";
        if (this.keys[20][2]) {
          print_str_upper = "h";
          if (parseInt(this.keys[4][2]) > 1) { // Meer dan 1 lamp
            print_str_upper += ", x" + this.keys[4][2];
          }
        } else if (parseInt(this.keys[4][2]) > 1) {
          print_str_upper = "x" + this.keys[4][2];
        }
        switch (this.keys[16][2]) {
          case "led":
            outputstr += '<use xlink:href="#led" x="' + 30 + '" y="25" />';

            if (this.keys[19][2]) {
              outputstr += '<line x1="30" y1="35" x2="42" y2="35" stroke="black" />';
            }
            //determine positioning of emergency symbol and draw it
            var noodxpos;
            var textxpos;
            if (print_str_upper == "") {
              noodxpos = 36;
              textxpos = 36; // not used
            } else {
              noodxpos = 20;
              if ( (print_str_upper.length > 2) && ( (this.keys[17][2] == "Centraal") || (this.keys[17][2] == "Decentraal") ) ) {
                textxpos = 40;
              } else {
                textxpos = 36;
              }
            };
            if (print_str_upper != "") {
              outputstr += '<text x="' + textxpos + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="7">' + htmlspecialchars(print_str_upper) + '</text>';
            }
            if (this.keys[21][2]) {
              outputstr += '<line x1="42" y1="25" x2="45.75" y2="17.5" stroke="black" />';
              outputstr += '<line x1="45.75" y1="17.5" x2="48.25" y2="18.75" stroke="black" />';
            }
            var noodypos = 6.5;
            switch (this.keys[17][2]) {
              case "Centraal":
                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                break;
              case "Decentraal":
                outputstr += '<rect x="' + (noodxpos-5.6) + '" y="' + (noodypos-5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />'
                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                break;
              default:
                break;
            }
            mySVG.xright = 42;
            //-- Plaats adres onderaan --
            outputstr += this.addAddress(mySVG,50,5,2);
            break;
          case "spot":
            outputstr += '<use xlink:href="#spot" x="' + 30 + '" y="25" />';

            if (this.keys[19][2]) {
              outputstr += '<line x1="30" y1="38" x2="46" y2="38" stroke="black" />';
            }
            //determine positioning of emergency symbol and draw it
            var noodxpos;
            var textxpos;
            if (print_str_upper == "") {
              noodxpos = 40;
              textxpos = 40; // not used
            } else {
              noodxpos = 24;
              if ( (print_str_upper.length > 2) && ( (this.keys[17][2] == "Centraal") || (this.keys[17][2] == "Decentraal") ) ) {
                textxpos = 44;
              } else {
                textxpos = 40;
              }
            };
            if (print_str_upper != "") {
              outputstr += '<text x="' + textxpos + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="7">' + htmlspecialchars(print_str_upper) + '</text>';
            }
            if (this.keys[21][2]) {
              outputstr += '<line x1="46" y1="25" x2="49.75" y2="17.5" stroke="black" />';
              outputstr += '<line x1="49.75" y1="17.5" x2="52.25" y2="18.75" stroke="black" />';
            }
            var noodypos = 6.5;
            switch (this.keys[17][2]) {
              case "Centraal":
                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                break;
              case "Decentraal":
                outputstr += '<rect x="' + (noodxpos-5.6) + '" y="' + (noodypos-5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />'
                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                break;
              default:
                break;
            }
            mySVG.xright = 45;
            //-- Plaats adres onderaan --
            outputstr += this.addAddress(mySVG,52,7,4);
            break;
          case "TL":
            var aantal_buizen = this.keys[13][2];
            var starty = 25-(aantal_buizen)*3.5;
            var endy = 25+(aantal_buizen)*3.5;
            outputstr += '<line x1="30" y1="' + starty + '" x2="30" y2="' + endy + '" stroke="black" stroke-width="2" />';
            outputstr += '<line x1="90" y1="' + starty + '" x2="90" y2="' + endy + '" stroke="black" stroke-width="2" />';
            for (var i = 0; i < aantal_buizen ; i++) {
              outputstr += '<line x1="30" y1="' + (starty + (i*7) + 3.5) + '" x2="90" y2="' + (starty + (i*7) + 3.5) + '" stroke="black" stroke-width="2" />';
            }
            if (this.keys[19][2]) {
              outputstr += '<line x1="50" y1="' + (27 + (aantal_buizen*3.5)) + '" x2="70" y2="' + (27 + (aantal_buizen*3.5)) + '" stroke="black" />';
            }
            if (print_str_upper != "") {
              outputstr += '<text x="60" y="' + (25 - (aantal_buizen*3.5)) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(print_str_upper) + '</text>';
            }
            if (this.keys[21][2]) {
              outputstr += '<line x1="77.5" y1="' + (29-(aantal_buizen*3.5)) + '" x2="85" y2="' + (14-(aantal_buizen*3.5)) + '" stroke="black" />';
              outputstr += '<line x1="85" y1="' + (14-(aantal_buizen*3.5)) + '" x2="90" y2="' + (16.5-(aantal_buizen*3.5)) + '" stroke="black" />';
            }
            //determine positioning of emergency symbol and draw it
            var noodxpos;
            if (print_str_upper == "") {noodxpos = 60} else {noodxpos = 39};
            var noodypos = (25 - (aantal_buizen*3.5) - 5);
            switch (this.keys[17][2]) {
              case "Centraal":
                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                break;
              case "Decentraal":
                outputstr += '<rect x="' + (noodxpos-5.6) + '" y="' + (noodypos-5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />'
                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                break;
            }
            mySVG.xright = 90;
            //-- Plaats adres onderaan --
            outputstr += this.addAddress(mySVG,endy+13,Math.max(mySVG.ydown,endy+18-25),2);
            break;
          default:
            switch (this.keys[17][2]) {
              case "Centraal":
                outputstr += '<use xlink:href="#lamp" x="' + 30 + '" y="25" />';
                outputstr += '<circle cx="30" cy="25" r="5" style="stroke:black;fill:black" />';
                if ( hasChild ) {
                  outputstr += '<line x1="'+30+'" y1="25" x2="'+(30+11)+'" y2="25" stroke="black" />';
                }
                break;
              case "Decentraal":
                outputstr += '<use xlink:href="#noodlamp_decentraal" x="' + 30 + '" y="25" />';
                if (this.keys[21][2]) { //Ingebouwde schakelaar
                  outputstr += '<line x1="37" y1="18" x2="40" y2="15" stroke="black" stroke-width="2" />';
                }
                break;
              default:
                outputstr += '<use xlink:href="#lamp" x="' + 30 + '" y="25" />';
                if ( hasChild ) {
                  outputstr += '<line x1="'+30+'" y1="25" x2="'+(30+11)+'" y2="25" stroke="black" />';
                }
                break;
            }
            if (print_str_upper != "") {
              outputstr += '<text x="30" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(print_str_upper) + '</text>';
            }
            if (this.keys[19][2]) {
              outputstr += '<line x1="20" y1="40" x2="40" y2="40" stroke="black" />';
            }
            if (this.keys[21][2]) {
              outputstr += '<line x1="40" y1="15" x2="45" y2="20" stroke="black" stroke-width="2" />';
            }
            mySVG.xright = 39;
            //-- Plaats adres onderaan --
            outputstr += this.addAddress(mySVG,54,10,-1);
            break;
        }
        break;
      case "Schakelaars":
        this.setKey("aantal2", 0);
        outputstr += this.toSVGswitches(hasChild, mySVG);
        break;
    }
    mySVG.data = outputstr + "\n";
    return(mySVG);
  }
}
