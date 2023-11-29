declare var require: any // make tsc happy
const pako2 = require('../build/pako/pako.min');
const fs = require('node:fs');

class EendraadschemaTree {
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
                    jsontext = decoder.decode(pako2.inflate(buffer));
                } catch (error) { //Continue without the text decoder (old browsers)
                    var inflated: Uint8Array = pako2.inflate(buffer);
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
    public to_html(mode: string) : string {
        return this.root_item.to_html(mode);
    }

    // Draw the complete schema to svg
    public to_svg() : string {
        return "";
    }
}

