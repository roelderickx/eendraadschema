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

