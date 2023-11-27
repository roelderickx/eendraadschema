declare var require: any // make tsc happy
const pako = require('../build/pako/pako.min');
const fs = require('node:fs');

// from ../src/Properties.ts
class Properties {
  filename: string;
  owner: string;
  installer: string;
  info: string;

  constructor() {
    this.filename = "eendraadschema.eds";
    this.owner = "Voornaam Achternaam<br>Straat 0<br>0000 gemeente<br>Tel: +32 00 00 00 00<br>GSM: +32 000 00 00 00<br>e-mail: voornaam.achternaam@domein.be";;
    this.installer = "idem";
    this.info = "<br>EAN ...<br><br>getekend met<br>https://www.eendraadschema.goethals-jacobs.be";
  };

  setFilename(name) {
    this.filename = name;
  }
}

// from ../src/Print_Table.ts
// functionality omitted for this proof of concept
class Print_Table {
  height: number;
  maxwidth: number;
  papersize: string;
  modevertical: string;
  starty: number;
  stopy: number;

  constructor() {
    this.height = 0;
    this.maxwidth = 0;
  }

  setHeight(height: number) {
    this.height = height;
  }

  getHeight(): number {
    return(this.height);
  }

  setMaxWidth(maxwidth: number) {
    this.maxwidth = maxwidth;
  }

  getMaxWidth(): number {
    return(this.maxwidth);
  }

  setPaperSize(papersize : string) {
    this.papersize = papersize;
  }

  getPaperSize() : string {
    if (!this.papersize) {
      this.papersize = "A4";
    }
    return(this.papersize);
  }

  setModeVertical(mode: string) {
    this.modevertical = mode;
  }

  getModeVertical(): string {
    return(this.modevertical);
  }

  getstarty(): number {
    return(this.starty);
  }

  getstopy(): number {
    return(this.stopy);
  }

  setstarty(starty: number) {
    this.starty = starty;
  }

  setstopy(stopy: number) {
    this.stopy = stopy;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////

// Abstract base class for all items
abstract class ElectroBaseItem {
    public id: number;
    public parent: ElectroBaseItem;
    public children: Array<ElectroBaseItem>;
    // item properties
    public type: string;
    public is_active: boolean;
    public is_collapsed: boolean;
    public naam: string;
    public commentaar: string;
    
    constructor(item_id: number) {
        this.id = item_id;
        this.parent = null;
        this.children = new Array<ElectroBaseItem>();
        
        this.initialize();
    }
    
    public initialize() {
        this.type = "";
        this.is_active = true;
        this.is_collapsed = false;
        this.naam = "";
        this.commentaar = "";
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        this.is_active = json_keys['active'];
        this.naam = json_keys['naam'];
        this.commentaar = json_keys['commentaar'];
    }

    public load_eds_v2_item(json_item) {
        // To be defined
    }

    // Searches the item corresponding to parent_id and adds the child below the found item
    public append_item(parent_id, child_item) : boolean {
        if (this.id == parent_id) {
            child_item.parent = this;
            this.children.push(child_item);
            return true;
        } else {
            for (var child of this.children) {
                if (child.append_item(parent_id, child_item)) {
                    return true;
                }
            }
            return false;
        }
    }
    
    protected get_consumers_of_children() : Array<string> {
        return ["", "Aansluiting", "Domotica", "Domotica gestuurde verbruiker", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Omvormer", "Overspanningsbeveiliging", "Microgolfoven", "Motor", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
    }

    // -- When called, this one ensures we cannot have a child that doesn't align with its parent --
    public get_consumers() : Array<string> {
        return this.parent.get_consumers_of_children(); // by default this depends on the parent
    }

    // children of this item are by default constraint to 1 child
    protected get_max_children_for_children() : number {
        return 1;
    }

    // Returns the amount of children allowed
    public get_max_children() : number {
        return this.parent.get_max_children_for_children(); // by default this depends on the parent
    }
    
    //-- Returns true if the Electro_Item can have childs in case it is or
    //   will become a child of Parent --
    public can_insert_child() : boolean {
        // Checks if the insert after button should be displayed or not
        return (this.get_max_children() > 0);
    }
    
    protected can_insert_after_for_children() : boolean {
        return false;
    }
    
    //-- Checks if the insert after button should be displayed or not in case the
    //   element is or will become a child of Parent --
    public can_insert_after() : boolean {
        return this.parent.can_insert_after_for_children(); // by default this depends on the parent
    }

    // prints the hierarchical list to the console for debugging purposes
    // output does not contain any item properties
    public to_stdout(indent: number = 0) {
        var indent_string: string = "";
        for (var i: number = 0; i < indent; i++) {
            indent_string += " ";
        }
        console.log(indent_string + this.id + ": " + Object.getPrototypeOf(this).constructor.name)

        for (var child of this.children) {
            child.to_stdout(indent+2);
        }
    }
    
    // helper function to export item properties to html, as textfield or checkbox
    protected keyToHtml(key_name: string, key_value: any, size?: number) {
        const hl_id: string = 'HL_edit_' + this.id + "_" + key_name;
        let output: string = '<input ';
        
        if (typeof key_value == "boolean") {
            output +=
                'type="checkbox" ' +
                'id="' + hl_id + '" ' +
                'onchange=HLUpdate(' + this.id + ',"' + key_name + '","BOOLEAN","' + hl_id + '") ' +
                'value="' + key_value + '" ' +
                (key_value ? 'checked ' : ' ') +
                '>';
        } else {
            output +=
                'type="text" ' +
                (size == null ? '' : 'size="' + size + '" ') +
                'id="' + hl_id + '" ' +
                'onchange=HLUpdate(' + this.id + ',"' + key_name + '","STRING","' + hl_id + '") ' +
                'value="' + key_value + '">';
        }
        
        return (output);
    }

    // helper function to export item properties to html, as selectlist
    protected selectToHtml(key_name: string, key_value: any, items: Array<string>) {
        const hl_id: string = 'HL_edit_' + this.id + "_" + key_name;
        var output: string = '<select ';

        output +=
            'id="' + hl_id + '" ' +
            'onchange=HLUpdate(' + this.id + ',"' + key_name + '","SELECT","' + hl_id + '")>';
        
        for (var i: number = 0; i < items.length; i++) {
            let options = '';
            if (items[i] == "---") {
                options = " disabled";
                items[i] = "---------------------------";
            } else if (items[i] == "-") {
                options = " disabled";
                items[i] = "---";
            } else if (key_value == items[i]) {
                options = " selected";
            }
            output += '<option value="' + items[i] + '"' + options + '>' + items[i] + '</option>';
        }
        
        output += "</select>"

        return (output);
    }
    
    // overridable function to export the item properties to html
    protected properties_to_html() : string {
        return this.selectToHtml("type", this.type, this.get_consumers());
    }

    // export the item as html
    public to_html(mode: string) : string {
        let output: string = "";
        
        if (this.is_collapsed) {
            output += '<table class="html_edit_table"><tr><td bgcolor="#8AB2E4" onclick="HLCollapseExpand(' + this.id + ')" valign= "top">&#x229E;</td><td width="100%">'
        } else {
            output += '<table class="html_edit_table"><tr><td bgcolor="#C0C0C0" onclick="HLCollapseExpand(' + this.id + ')" valign= "top">&#x229F;</td><td width="100%">'
        }

        if (mode == "move") {
            output += "<b>ID: "+this.id+"</b>, ";
            output += 'Moeder: <input id="id_parent_change_' + this.id + '" type="text" size="2" value="' + this.parent.id + '" onchange="HL_changeparent(' + this.id + ')"> ';
            output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveUp(" + this.id +")\">&#9650;</button>";
            output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveDown(" + this.id +")\">&#9660;</button>";
            if (this.can_insert_after()) {
                output += " <button style=\"background-color:lightblue;\" onclick=\"HLClone(" + this.id +")\">Clone</button>";
            }
        } else {
            if (this.can_insert_after()) {
                output += " <button style=\"background-color:green;\" onclick=\"HLInsertBefore(" + this.id +")\">&#9650;</button>";
                output += " <button style=\"background-color:green;\" onclick=\"HLInsertAfter(" + this.id +")\">&#9660;</button>";
            }
            if (this.can_insert_child()) {
                output += " <button style=\"background-color:green;\" onclick=\"HLInsertChild(" + this.id +")\">&#9654;</button>";
            }
        }
        output += " <button style=\"background-color:red;\" onclick=\"HLDelete(" + this.id +")\">&#9851;</button>";
        output += "&nbsp;"
        
        output += this.properties_to_html();

        if (!this.is_collapsed) {
            for (var child of this.children) {
                output += child.to_html(mode);
            }
        }

        output += "</td></tr></table>";
        
        return output;
    }
}

class RootItem extends ElectroBaseItem {
    constructor() {
        // top node always has id 0
        super(0);
    }
    
    public initialize() {
        super.initialize();

        this.type = "root";
    }
    
    public get_consumers() : Array<string> {
        return ["", "Kring", "Aansluiting"];
    }
    
    public get_max_children() : number {
        return 256;
    }
    
    public can_insert_after() : boolean {
        return true;
    }
    
    public to_html(mode: string) : string {
        var output: string = "";
        
        //-- bovenaan de switch van editeer-mode (teken of verplaats) --
        switch (mode) {
        case "edit":
            output += 'Modus (Invoegen/Verplaatsen/Clone) <select id="edit_mode" onchange="HL_editmode()"><option value="edit" selected>Invoegen</option><option value="move">Verplaatsen/Clone</option></select><br><br>';
            break;
        case "move":
            output += 'Modus (Invoegen/Verplaatsen/Clone) <select id="edit_mode" onchange="HL_editmode()"><option value="edit">Invoegen</option><option value="move" selected>Verplaatsen/Clone</option></select>' +
                '<span style="color:black"><i>&nbsp;Gebruik de pijlen om de volgorde van elementen te wijzigen. ' +
                'Gebruik het Moeder-veld om een component elders in het schema te hangen. Kies "clone" om een dubbel te maken van een element.</i></span><br><br>';
            break;
        }

        //-- plaats input box voor naam van het schema bovenaan --
        //output += 'Bestandsnaam: <span id="settings"><code>' + this.properties.filename + '</code>&nbsp;<button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button></span><br><br>'

        var active_child_exists: boolean = false;
        for (var child of this.children) {
            if (child.is_active) {
                output += child.to_html(mode);
                active_child_exists = true;
            }
        }
        
        if (!active_child_exists) {
            //no need for the add button if we have items
            output += "<button onclick=\"HLAdd()\">Voeg eerste object toe of kies bovenaan \"Nieuw\"</button><br>";
        }
        
        return output;
    }
}

class AansluitingItem extends ElectroBaseItem {
    private aantal_polen: number; // 4
    private zekering_type: string; // 7
    private amperage: number; // 8
    private kabel_type: string; // 9
    private differentieel_waarde: number; // 11
    private differentieel_type: string; // 17
    private curve: string; // 18 of 17 als zekering_type == automatisch
    private is_selectief: boolean; // 20
    private kortsluitvermogen: number; // 22
    private aansluiting_naam: string; // 23
    private kabel_type_voor_teller: string; // 24
    
    public initialize() {
        super.initialize();

        this.type = "Aansluiting";
        this.aantal_polen = 1;
        this.zekering_type = (this.parent && this.parent.type == "Splitsing") ? "geen" : "automatisch";
        this.amperage = 20;
        this.kabel_type = "XVB 3G2,5";
        this.naam = "---";
        this.differentieel_waarde = 300;
        this.differentieel_type = "";
        this.curve = "";
        this.is_selectief = false;
        this.kortsluitvermogen = null;
        this.aansluiting_naam = "";
        this.kabel_type_voor_teller = "";
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.aantal_polen = json_keys['aantal'];
        this.zekering_type = json_keys['zekering'];
        this.amperage = json_keys['amperage'];
        this.kabel_type = json_keys['kabel'];
        this.differentieel_waarde = json_keys['differentieel_waarde'];
        this.differentieel_type = json_keys['select2'];
        this.curve = this.zekering_type == "automatisch" ? json_keys['select2'] : json_keys['select3'];
        this.is_selectief = json_keys['bool2'];
        this.kortsluitvermogen = json_keys['string1'];
        this.aansluiting_naam = json_keys['string2'];
        this.kabel_type_voor_teller = json_keys['string3'];
    }

    protected get_consumers_of_children() : Array<string> {
        return ["", "Bord", "Kring", "Splitsing"];
    }
    
    public get_max_children() : number {
        return 256;
    }
    
    protected can_insert_after_for_children() : boolean {
        return true;
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        
        output += "&nbsp;Naam: " + this.keyToHtml("string2", this.aansluiting_naam, 5) + "<br>";
        if (this.parent.id > 0) output += "Nr: " + this.keyToHtml("naam", this.naam, 5) + ", ";
        output += "Zekering: " + this.selectToHtml("zekering", this.zekering_type, ["automatisch", "differentieel", "differentieelautomaat", "smelt", "geen", "---", "schakelaar", "schemer"]) +
                                   this.selectToHtml("aantal", this.aantal_polen, ["2", "3", "4"]) +
                                   this.keyToHtml("amperage", this.amperage, 2) + "A";
        if (this.zekering_type == "differentieel") {
          output += ", \u0394 " + this.keyToHtml("differentieel_waarde", this.differentieel_waarde, 3) + "mA";
          output += ", Type:" + this.selectToHtml("select2", this.differentieel_type, ["", "A", "B"]);
          output += ", Kortsluitvermogen: " + this.keyToHtml("string1", this.kortsluitvermogen, 3) + "kA";
          output += ", Selectief: " + this.keyToHtml("bool2", this.is_selectief);
        } else if (this.zekering_type == "automatisch") {
          output += ", Curve:" + this.selectToHtml("select2", this.curve, ["", "B", "C", "D"]);
          output += ", Kortsluitvermogen: " + this.keyToHtml("string1", this.kortsluitvermogen, 3) + "kA";
        } else if (this.zekering_type == "differentieelautomaat") {
          output += ", \u0394 " + this.keyToHtml("differentieel_waarde", this.differentieel_waarde, 3) + "mA";
          output += ", Curve:" + this.selectToHtml("select3", this.curve, ["", "B", "C", "D"]);
          output += ", Type:" + this.selectToHtml("select2", this.differentieel_type, ["", "A", "B"]);
          output += ", Kortsluitvermogen: " + this.keyToHtml("string1", this.kortsluitvermogen, 3) + "kA";
          output += ", Selectief: " + this.keyToHtml("bool2", this.is_selectief);
        }
        output += ", Kabeltype na teller: " + this.keyToHtml("kabel", this.kabel_type, 10);
        output += ", Kabeltype v&oacute;&oacute;r teller: " + this.keyToHtml("string3", this.kabel_type_voor_teller, 10);
        output += ", Adres/tekst: " + this.keyToHtml("commentaar", this.commentaar, 10);
        
        return output;
    }
}


class AansluitpuntItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Aansluitpunt";
    }
    
    protected get_max_children_for_children() : number {
        return 0;
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class AftakdoosItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Aftakdoos";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class BatterijItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Batterij";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class BelItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Bel";
    }
    
    public get_max_children() : number {
        return 0;
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class BoilerItem extends ElectroBaseItem {
    accumulatie: boolean;
    
    public initialize() {
        super.initialize();

        this.type = "Boiler";
        this.accumulatie = false;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.accumulatie = json_keys['accumulatie'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class BordItem extends ElectroBaseItem {
    geaard: boolean;
    
    public initialize() {
        super.initialize();

        this.type = "Bord";
        this.geaard = true;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.geaard = json_keys['geaard'];
    }

    protected get_consumers_of_children() : Array<string> {
        return ["", "Kring"];
    }
    
    protected get_max_children_for_children() : number {
        return 0;
    }
    
    public get_max_children() : number {
        return 256;
    }
    
    protected can_insert_after_for_children() : boolean {
        return true;
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class DiepvriezerItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Diepvriezer";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class DomoticaItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Domotica";
    }

    protected get_consumers_of_children() : Array<string> {
        return ["", "Kring"];
    }
    
    protected get_max_children_for_children() : number {
        return 0;
    }
    
    public get_max_children() : number {
        return 256;
    }
    
    protected can_insert_after_for_children() : boolean {
        return true;
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class DomoticaVerbruikerItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Domotica gestuurde verbruiker";
    }

    protected get_consumers_of_children() : Array<string> {
        return ["", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
    }
    
    public get_max_children() : number {
        return 1;
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class DroogkastItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Droogkast";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class DrukknopItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Drukknop";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class ElektriciteitsmeterItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Elektriciteitsmeter";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class ElektrischeOvenItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Elektrische oven";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class EVLaderItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "EV lader";
    }
}


class KetelItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Ketel";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class KoelkastItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Koelkast";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class KookfornuisItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Kookfornuis";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class KringItem extends ElectroBaseItem {
    private aantal_polen: number; // 4
    private zekering_type: string; // 7
    private amperage: number; // 8
    private kabel_type: string; // 9
    private differentieel_waarde: number; // 11
    private kabel_aanwezig: boolean; // 12
    private plaatsing: string; // 16
    private differentieel_type: string; // 17
    private curve: string; // 18 of 17 als zekering_type == automatisch
    private in_buis: boolean; // 19
    private is_selectief: boolean; // 20
    private kortsluitvermogen: number; // 22
    
    public initialize() {
        super.initialize();

        this.type = "Kring";
        this.aantal_polen = 1;
        this.zekering_type = (this.parent && this.parent.type == "Splitsing") ? "geen" : "automatisch";
        this.amperage = 20;
        this.kabel_type = "XVB 3G2,5";
        this.naam = "---";
        this.differentieel_waarde = 300;
        this.kabel_aanwezig = (this.parent && this.parent.type == "Splitsing") ? false : true;
        this.plaatsing = "N/A";
        this.differentieel_type = "";
        this.curve = "";
        this.in_buis = false;
        this.is_selectief = false;
        this.kortsluitvermogen = null;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.aantal_polen = json_keys['aantal'];
        this.zekering_type = json_keys['zekering'];
        this.amperage = json_keys['amperage'];
        this.kabel_type = json_keys['kabel'];
        this.differentieel_waarde = json_keys['differentieel_waarde'];
        this.kabel_aanwezig = json_keys['kabel_aanwezig'];
        this.plaatsing = json_keys['select1'];
        this.differentieel_type = json_keys['select2'];
        this.curve = this.zekering_type == "automatisch" ? json_keys['select2'] : json_keys['select3'];
        this.in_buis = json_keys['bool1'];
        this.is_selectief = json_keys['bool2'];
        this.kortsluitvermogen = json_keys['string1'];
    }

    protected get_consumers_of_children() : Array<string> {
        return ["", "Aansluiting", "Bord", "Domotica", "Domotica gestuurde verbruiker", "Kring", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
    }
    
    public get_max_children() : number {
        return 256;
    }
    
    protected can_insert_after_for_children() : boolean {
        return true;
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Naam: " + this.keyToHtml("naam", this.naam, 5) + "<br>";
        output += "Zekering: " + this.selectToHtml("zekering", this.zekering_type, ["automatisch", "differentieel", "differentieelautomaat", "smelt", "geen", "---", "schakelaar", "relais", "schemer", "overspanningsbeveiliging"]);
        if ( (this.zekering_type != "geen") && (this.zekering_type != "relais") ) {
            output += this.selectToHtml("aantal", this.aantal_polen, ["2","3","4","-","1"]) + this.keyToHtml("amperage", this.amperage, 2) + "A";
        }
        if (this.zekering_type == "differentieel") {
          output += ", \u0394 " + this.keyToHtml("differentieel_waarde", this.differentieel_waarde, 3) + "mA";
          output += ", Type:" + this.selectToHtml("select2", this.differentieel_type, ["", "A", "B"]);
          output += ", Kortsluitvermogen: " + this.keyToHtml("string1", this.kortsluitvermogen, 3) + "kA";
          output += ", Selectief: " + this.keyToHtml("bool2", this.is_selectief);
        } else if (this.zekering_type == "automatisch") {
          output += ", Curve:" + this.selectToHtml("select2", this.curve, ["", "B", "C", "D"]);
          output += ", Kortsluitvermogen: " + this.keyToHtml("string1", this.kortsluitvermogen, 3) + "kA";
        } else if (this.zekering_type == "differentieelautomaat") {
          output += ", \u0394 " + this.keyToHtml("differentieel_waarde", this.differentieel_waarde, 3) + "mA";
          output += ", Curve:" + this.selectToHtml("select3", this.curve, ["", "B", "C", "D"]);
          output += ", Type:" + this.selectToHtml("select2", this.differentieel_type, ["", "A", "B"]);
          output += ", Kortsluitvermogen: " + this.keyToHtml("string1", this.kortsluitvermogen, 3) + "kA";
          output += ", Selectief: " + this.keyToHtml("bool2", this.is_selectief);
        }
        output += ", Kabel: " + this.keyToHtml("kabel_aanwezig", this.kabel_aanwezig);
        if (this.kabel_aanwezig) {
          output += ", Type: " + this.keyToHtml("kabel", this.kabel_type, 10);
          output += ", Plaatsing: " + this.selectToHtml("select1", this.plaatsing, ["N/A", "Ondergronds", "Luchtleiding", "In wand", "Op wand"]);
          if (this.plaatsing != "Luchtleiding") {
            output += ", In buis: " + this.keyToHtml("bool1", this.in_buis);
          }
        }
        output += ", Tekst: " + this.keyToHtml("commentaar", this.commentaar, 10);

        return output;
    }
}


class LeegItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Leeg";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class LichtcircuitItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Lichtcircuit";
    }
    
    public get_max_children() : number {
        return 0;
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class LichtpuntItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Lichtpunt";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class MeerdereVerbruikersItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Meerdere verbruikers";
    }

    protected get_consumers_of_children() : Array<string> {
        return ["", "Domotica", "Domotica gestuurde verbruiker", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Omvormer", "Overspanningsbeveiliging", "Microgolfoven", "Motor", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
    }
    
    protected get_max_children_for_children() : number {
        return 0;
    }
    
    public get_max_children() : number {
        return 256;
    }
    
    protected can_insert_after_for_children() : boolean {
        return true;
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class MicrogolfovenItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Microgolfoven";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class MotorItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Motor";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class OmvormerItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Omvormer";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class OverspanningsbeveiligingItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Overspanningsbeveiliging";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class SchakelaarsItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Schakelaars";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class SplitsingItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Splitsing";
    }

    protected get_consumers_of_children() : Array<string> {
        return ["", "Kring"];
    }
    
    protected get_max_children_for_children() : number {
        return 0;
    }
    
    public get_max_children() : number {
        return 256;
    }
    
    protected can_insert_after_for_children() : boolean {
        return true;
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class StoomovenItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Stoomoven";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class StopcontactItem extends ElectroBaseItem {
    geaard: boolean;
    kinderveiligheid: boolean;
    
    public initialize() {
        super.initialize();

        this.type = "Stopcontact";
        this.geaard = true;
        this.kinderveiligheid = true;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.geaard = json_keys['geaard'];
        this.kinderveiligheid = json_keys['kinderveiligheid'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class TransformatorItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Transformator";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class USBLaderItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "USB lader";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class VaatwasmachineItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Vaatwasmachine";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class VentilatorItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Ventilator";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class VerlengingItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Verlenging";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class VerwarmingstoestelItem extends ElectroBaseItem {
    accumulatie: boolean;
    
    public initialize() {
        super.initialize();

        this.type = "Verwarmingstoestel";
        this.accumulatie = false;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.accumulatie = json_keys['accumulatie'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class VrijeTekstItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Vrije tekst";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class WarmtepompAircoItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Warmtepomp/airco";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class WasmachineItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Wasmachine";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class ZeldzameSymbolenItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Zeldzame symbolen";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class ZonnepaneelItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Zonnepaneel";
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();
        return output;
    }
}


class EendraadschemaList {
    properties: Properties;
    print_table: Print_Table;
    root_item: RootItem;
    
    constructor() {
        this.properties = new Properties();
        this.print_table = new Print_Table();
        this.root_item = new RootItem();
    }
    
    // Creates instance of an ElectroBaseItem subclass
    private create_electro_item(type: string, id: number) : ElectroBaseItem {
        switch (type) {
        case "root": { return new RootItem(); break; }
        case "Aansluiting": { return new AansluitingItem(id); break; }
        case "Aansluitpunt": { return new AansluitpuntItem(id); break; }
        case "Aftakdoos": { return new AftakdoosItem(id); break; }
        case "Batterij": { return new BatterijItem(id); break; }
        case "Bel": { return new BelItem(id); break; }
        case "Boiler": { return new BoilerItem(id); break; }
        case "Bord": { return new BordItem(id); break; }
        case "Diepvriezer": { return new DiepvriezerItem(id); break; }
        case "Domotica": { return new DomoticaItem(id); break; }
        case "Domotica gestuurde verbruiker": { return new DomoticaVerbruikerItem(id); break; }
        case "Droogkast": { return new DroogkastItem(id); break; }
        case "Drukknop": { return new DrukknopItem(id); break; }
        case "Elektriciteitsmeter": { return new ElektriciteitsmeterItem(id); break; }
        case "Elektrische oven": { return new ElektrischeOvenItem(id); break; }
        case "EV lader": { return new EVLaderItem(id); break; }
        case "Ketel": { return new KetelItem(id); break; }
        case "Koelkast": { return new KoelkastItem(id); break; }
        case "Kookfornuis": { return new KookfornuisItem(id); break; }
        case "Kring": { return new KringItem(id); break; }
        case "Leeg": { return new LeegItem(id); break; }
        case "Lichtcircuit": { return new LichtcircuitItem(id); break; }
        case "Lichtpunt": { return new LichtpuntItem(id); break; }
        case "Meerdere verbruikers": { return new MeerdereVerbruikersItem(id); break; }
        case "Microgolfoven": { return new MicrogolfovenItem(id); break; }
        case "Motor": { return new MotorItem(id); break; }
        case "Omvormer": { return new OmvormerItem(id); break; }
        case "Overspanningsbeveiliging": { return new OverspanningsbeveiligingItem(id); break; }
        case "Schakelaars": { return new SchakelaarsItem(id); break; }
        case "Splitsing": { return new SplitsingItem(id); break; }
        case "Stoomoven": { return new StoomovenItem(id); break; }
        case "Stopcontact": { return new StopcontactItem(id); break; }
        case "Transformator": { return new TransformatorItem(id); break; }
        case "USB lader": { return new USBLaderItem(id); break; }
        case "Vaatwasmachine": { return new VaatwasmachineItem(id); break; }
        case "Ventilator": { return new VentilatorItem(id); break; }
        case "Verlenging": { return new VerlengingItem(id); break; }
        case "Verwarmingstoestel": { return new VerwarmingstoestelItem(id); break; }
        case "Vrije tekst": { return new VrijeTekstItem(id); break; }
        case "Warmtepomp/airco": { return new WarmtepompAircoItem(id); break; }
        case "Wasmachine": { return new WasmachineItem(id); break; }
        case "Zeldzame symbolen": { return new ZeldzameSymbolenItem(id); break; }
        case "Zonnepaneel": { return new ZonnepaneelItem(id); break; }
        default: return null;
        }
    }
    
    // Read eds file, either v0, v1 or v2
    public load_eds(filename: string) {
        try {
            const data: string = fs.readFileSync(filename, 'utf8');
            var eds_version: string = "000";
            var jsontext: string = "";
            
            if (data.substring(0, 3) == "EDS") {
                // If first 3 bytes read "EDS", it is an entropy coded file
                // The next 3 bytes indicate the version
                eds_version = data.substring(3, 6);
                // The next 4 bytes are decimal zeroes "0000"
                // thereafter is a base64 encoded data-structure
                var bindata: string = atob(data.substring(10, data.length))
                var buffer: Uint8Array = new Uint8Array(bindata.length);
                for (var i = 0; i < bindata.length; i++) {
                    buffer[i-0] = bindata.charCodeAt(i);
                }
                try { //See if the text decoder works, if not, we will do it manually (slower)
                    let decoder = new TextDecoder("utf-8");
                    jsontext = decoder.decode(pako.inflate(buffer));
                } catch (error) { //Continue without the text decoder (old browsers)
                    var inflated: Uint8Array = pako.inflate(buffer);
                    jsontext = "";
                    for (i = 0; i < inflated.length; i++) {
                        jsontext += String.fromCharCode(inflated[i])
                    }
                }
            } else {
                // If first 3 bytes do not read "EDS", the file is in the old non encoded format
                // and can be used as is
                jsontext = data;
            }
            
            const jsondata = JSON.parse(jsontext);
            // parse properties
            if (typeof jsondata.properties.filename != "undefined") {
                this.properties.filename = jsondata.properties.filename;
            }
            if (typeof jsondata.properties.owner != "undefined") {
                this.properties.owner = jsondata.properties.owner;
            }
            if (typeof jsondata.properties.installer != "undefined") {
                this.properties.installer = jsondata.properties.installer;
            }
            if (typeof jsondata.properties.info != "undefined") {
                this.properties.info = jsondata.properties.info;
            }
            // parse printdata
            if (typeof jsondata.print_table != "undefined") {
                this.print_table.setHeight(jsondata.print_table.height);
                this.print_table.setMaxWidth(jsondata.print_table.maxwidth);
                this.print_table.setPaperSize(jsondata.print_table.papersize);
                this.print_table.setModeVertical(jsondata.print_table.modevertical);
                this.print_table.setstarty(jsondata.print_table.starty);
                this.print_table.setstopy(jsondata.print_table.stopy);
            }
            // parse data
            var item_index: number = 0;
            for (var item of jsondata.data) {
                if (eds_version == "000" || eds_version == "001") {
                    var electro_keys: Record<string, any> = {};
                    for (var key of item.keys) {
                        electro_keys[key[0]] = key[2];
                    }
                    electro_keys["active"] = jsondata.active[item_index];
                    var electro_item : ElectroBaseItem =
                        this.create_electro_item(electro_keys["type"], item.id as number);
                    electro_item.load_eds_v1_item(electro_keys);
                } /*else if (eds_version == "002") {
                    var electro_item : ElectroBaseItem =
                        this.create_electro_item(item.type, item.id as number);
                    electro_item.load_eds_v2_item(item);
                }*/
                this.root_item.append_item(item.parent as number, electro_item)
                
                item_index++;
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Output the complete schema to stdout
    public to_stdout() {
        this.root_item.to_stdout();
    }

    // Draw the complete schema to html
    public to_html(mode: string) {
        return this.root_item.to_html(mode);
    }

    // Draw the complete schema to svg
    public to_svg() {
    }
}

// main

var eendraadschema = new EendraadschemaList();
eendraadschema.load_eds("../build/examples/example001.eds");
console.log(eendraadschema.to_html("edit"));

