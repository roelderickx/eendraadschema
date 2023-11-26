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
    private id: number;
    protected parent: ElectroBaseItem;
    protected children: Array<ElectroBaseItem>;
    protected is_active: boolean;
    
    constructor(item_id: number) {
        this.id = item_id;
        this.parent = null;
        this.children = new Array<ElectroBaseItem>();
        
        // common properties
        this.is_active = true;
    }

    protected load_eds_v1_item(json_keys: Record<string, any>) {
         this.is_active = json_keys['active'];
    }

    protected load_eds_v2_item(json_item) {
        // To be defined
    }

    // Searches the item corresponding to parent_id and adds the child below the found item
    append_item(parent_id, child_item) : boolean {
        if (this.id == parent_id) {
            child_item.parent = this;
            this.children.push(child_item);
            return true;
        }
        else {
            for (var child of this.children) {
                if (child.append_item(parent_id, child_item)) {
                    return true;
                }
            }
            return false;
        }
    }

    //Returns all valid child types
    get_consumers() : Array<string> {
        return ["", "Aansluiting", "Domotica", "Domotica gestuurde verbruiker", "Meerdere verbruikers", "Splitsing", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Omvormer", "Overspanningsbeveiliging", "Microgolfoven", "Motor", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
    }

    // children of this item are by default constraint to 1 child
    protected get_max_children_for_children() : number {
        return 1;
    }

    // Returns the amount of children allowed
    // by default this depends on the parent
    get_max_children() : number {
        return this.parent.get_max_children_for_children();
    }
    
    protected print_item(indent: number) {
        var indent_string: string = "";
        for (var i: number = 0; i < indent; i++) {
            indent_string += " ";
        }
        console.log(indent_string + this.id + ": " + Object.getPrototypeOf(this).constructor.name)
    }

    to_stdout(indent: number = 0) {
        this.print_item(indent);
        for (var child of this.children) {
            child.to_stdout(indent+2);
        }
    }
}

class RootItem extends ElectroBaseItem {
    constructor() {
        // top node always has id 0
        super(0);
    }
    
    get_max_children() : number {
        return 256;
    }
}

class AansluitingItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }

    get_consumers() : Array<string> {
        return ["", "Bord", "Kring", "Splitsing"];
    }
    
    get_max_children() : number {
        return 256;
    }
}


class AansluitpuntItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
    
    protected get_max_children_for_children() : number {
        return 0;
    }
}


class AftakdoosItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class BatterijItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class BelItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
    
    get_max_children() : number {
        return 0;
    }
}


class BoilerItem extends ElectroBaseItem {
    accumulatie: boolean;
    
    constructor(item_id: number) {
        super(item_id);
        this.accumulatie = false;
    }

    protected load_eds_v1_item(json_keys: Record<string, any>) {
         super.load_eds_v1_item(json_keys);
         this.accumulatie = json_keys['accumulatie'];
    }

    protected print_item(indent: number) {
        super.print_item(indent);
        var indent_string: string = "";
        for (var i: number = 0; i < indent; i++) {
            indent_string += " ";
        }
        console.log(indent_string + "Accumulatie " + this.accumulatie);
    }
}


class BordItem extends ElectroBaseItem {
    geaard: boolean;
    
    constructor(item_id: number) {
        super(item_id);
        this.geaard = true;
    }

    protected load_eds_v1_item(json_keys: Record<string, any>) {
         super.load_eds_v1_item(json_keys);
         this.geaard = json_keys['geaard'];
    }

    get_consumers() : Array<string> {
        return ["", "Kring"];
    }
    
    protected get_max_children_for_children() : number {
        return 0;
    }
    
    get_max_children() : number {
        return 256;
    }

    protected print_item(indent: number) {
        super.print_item(indent);
        var indent_string: string = "";
        for (var i: number = 0; i < indent; i++) {
            indent_string += " ";
        }
        console.log(indent_string + "Geaard " + this.geaard);
    }
}


class DiepvriezerItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class DomoticaItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }

    get_consumers() : Array<string> {
        return ["", "Kring"];
    }
    
    protected get_max_children_for_children() : number {
        return 0;
    }
    
    get_max_children() : number {
        return 256;
    }
}


class DomoticaVerbruikerItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }

    get_consumers() : Array<string> {
        return ["", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
    }
    
    get_max_children() : number {
        return 1;
    }
}


class DroogkastItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class DrukknopItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class ElektriciteitsmeterItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class ElektrischeOvenItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class EVLaderItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class KetelItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class KoelkastItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class KookfornuisItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class KringItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }

    get_consumers() : Array<string> {
        return ["", "Aansluiting", "Bord", "Domotica", "Domotica gestuurde verbruiker", "Kring", "Meerdere verbruikers", "Splitsing", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
    }
    
    get_max_children() : number {
        return 256;
    }
}


class LeegItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class LichtcircuitItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
    
    get_max_children() : number {
        return 0;
    }
}


class LichtpuntItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class MeerdereVerbruikersItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }

    get_consumers() : Array<string> {
        return ["", "Domotica", "Domotica gestuurde verbruiker", "Splitsing", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Omvormer", "Overspanningsbeveiliging", "Microgolfoven", "Motor", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
    }
    
    protected get_max_children_for_children() : number {
        return 0;
    }
    
    get_max_children() : number {
        return 256;
    }
}


class MicrogolfovenItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class MotorItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class OmvormerItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class OverspanningsbeveiligingItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class SchakelaarsItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class SplitsingItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }

    get_consumers() : Array<string> {
        return ["", "Kring"];
    }
    
    protected get_max_children_for_children() : number {
        return 0;
    }
    
    get_max_children() : number {
        return 256;
    }
}


class StoomovenItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class StopcontactItem extends ElectroBaseItem {
    geaard: boolean;
    kinderveiligheid: boolean;
    
    constructor(item_id: number) {
        super(item_id);
        this.geaard = true;
        this.kinderveiligheid = true;
    }

    protected load_eds_v1_item(json_keys: Record<string, any>) {
         super.load_eds_v1_item(json_keys);
         this.geaard = json_keys['geaard'];
         this.kinderveiligheid = json_keys['kinderveiligheid'];
    }

    protected print_item(indent: number) {
        super.print_item(indent);
        var indent_string: string = "";
        for (var i: number = 0; i < indent; i++) {
            indent_string += " ";
        }
        console.log(indent_string + "Geaard " + this.geaard);
        console.log(indent_string + "Kinderveiligheid " + this.kinderveiligheid);
    }
}


class TransformatorItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class USBLaderItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class VaatwasmachineItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class VentilatorItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class VerlengingItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class VerwarmingstoestelItem extends ElectroBaseItem {
    accumulatie: boolean;
    
    constructor(item_id: number) {
        super(item_id);
        this.accumulatie = false;
    }

    protected load_eds_v1_item(json_keys: Record<string, any>) {
         super.load_eds_v1_item(json_keys);
         this.accumulatie = json_keys['accumulatie'];
    }

    protected print_item(indent: number) {
        super.print_item(indent);
        var indent_string: string = "";
        for (var i: number = 0; i < indent; i++) {
            indent_string += " ";
        }
        console.log(indent_string + "Accumulatie " + this.accumulatie);
    }
}


class VrijeTekstItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class WarmtepompAircoItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class WasmachineItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class ZeldzameSymbolenItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class ZonnepaneelItem extends ElectroBaseItem {
    constructor(item_id: number) {
        super(item_id);
    }
}


class Eendraadschema {
    properties: Properties;
    print_table: Print_Table;
    root_item: RootItem;
    
    constructor() {
        this.properties = new Properties();
        this.print_table = new Print_Table();
        this.root_item = new RootItem();
    }
    
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
    load_eds(filename: string) {
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
            }
            else {
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
            for (var item of jsondata.data) {
                if (eds_version == "000" || eds_version == "001") {
                    var electro_keys: Record<string, any> = {};
                    for (var key of item.keys) {
                        electro_keys[key[0]] = key[2];
                    }
                    var electro_item : ElectroBaseItem =
                        this.create_electro_item(electro_keys["type"], item.id as number);
                    electro_item.load_eds_v1_item(electro_keys);
                }
                /*else if (eds_version == "002") {
                    var electro_item : ElectroBaseItem =
                        this.create_electro_item(item.type, item.id as number);
                    electro_item.load_eds_v2_item(item);
                }*/
                this.root_item.append_item(item.parent as number, electro_item)
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Output the complete schema to stdout
    to_stdout() {
        this.root_item.to_stdout();
    }
}

// main

var eendraadschema = new Eendraadschema();
eendraadschema.load_eds("../build/examples/example001.eds");
eendraadschema.to_stdout();

