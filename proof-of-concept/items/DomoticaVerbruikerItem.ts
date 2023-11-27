class DomoticaVerbruikerItem extends ElectroBaseItem {
    private externe_sturing: string; // 5
    private is_draadloos: boolean; // 19
    private has_lokale_drukknop: boolean; // 20
    private is_geprogrammeerd: boolean; // 21
    private has_detectie: boolean; // 25
    private has_externe_sturing: boolean; // 26
    
    public initialize() {
        super.initialize();

        this.type = "Domotica gestuurde verbruiker";
        this.externe_sturing = "";
        this.is_draadloos = false;
        this.has_lokale_drukknop = false;
        this.is_geprogrammeerd = false;
        this.has_detectie = false;
        this.has_externe_sturing = false;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.externe_sturing = json_keys['lichtkring_poligheid'];
        this.is_draadloos = json_keys['bool1'];
        this.has_lokale_drukknop = json_keys['bool2'];
        this.is_geprogrammeerd = json_keys['bool3'];
        this.has_detectie = json_keys['bool4'];
        this.has_externe_sturing = json_keys['bool5'];
    }

    protected get_consumers_of_children() : Array<string> {
        return ["", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
    }
    
    public get_max_children() : number {
        return 1;
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5);
        output += ", Draadloos: " + this.keyToHtml("bool1", this.is_draadloos);  
        output += ", Lokale Drukknop: " + this.keyToHtml("bool2", this.has_lokale_drukknop);  
        output += ", Geprogrammeerd: " + this.keyToHtml("bool3", this.is_geprogrammeerd);  
        output += ", Detectie: " + this.keyToHtml("bool4", this.has_detectie);
        output += ", Externe sturing: " + this.keyToHtml("bool5", this.has_externe_sturing);    
        if (this.has_externe_sturing) {
          output += ", Externe sturing: " + this.selectToHtml("lichtkring_poligheid", this.externe_sturing, ["drukknop", "schakelaar"]);    
        }
        output += ", Adres/tekst: " + this.keyToHtml("commentaar", this.commentaar, 5);

        return output;
    }
}

