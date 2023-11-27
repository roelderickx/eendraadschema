class LichtpuntItem extends ElectroBaseItem {
    private aantal_lampen: number; // 4
    private aantal_buizen: number; // 13
    private type_lichtpunt: string; // 16
    private noodverlichting: string; // 17
    private is_wandlamp: boolean; // 19
    private is_halfwaterdicht: boolean; // 20
    private has_ingebouwde_schakelaar: boolean; // 21
    
    public initialize() {
        super.initialize();

        this.type = "Lichtpunt";
        this.aantal_lampen = 1;
        this.aantal_buizen = 1;
        this.type_lichtpunt = "";
        this.noodverlichting = "";
        this.is_wandlamp = false;
        this.is_halfwaterdicht = false;
        this.has_ingebouwde_schakelaar = false;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.aantal_lampen = json_keys['aantal'];
        this.aantal_buizen = json_keys['aantal2'];
        this.type_lichtpunt = json_keys['select1'];
        this.noodverlichting = json_keys['select2'];
        this.is_wandlamp = json_keys['bool1'];
        this.is_halfwaterdicht = json_keys['bool2'];
        this.has_ingebouwde_schakelaar = json_keys['bool3'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5) + ", ";
        output += "Type: " + this.selectToHtml("select1", this.type_lichtpunt, ["standaard", "TL", "spot", "led" /*, "Spot", "Led", "Signalisatielamp" */]) + ", ";
        if (this.type_lichtpunt == "TL") {
          output += "Aantal buizen: " + this.selectToHtml("aantal2", this.aantal_buizen, ["1", "2", "3", "4"]) + ", ";
        }
        output += "Aantal lampen: " + this.selectToHtml("aantal", this.aantal_lampen, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]) + ", ";
        output += "Wandlamp: " + this.keyToHtml("bool1", this.is_wandlamp) + ", ";
        output += "Halfwaterdicht: " + this.keyToHtml("bool2", this.is_halfwaterdicht) + ", ";
        output += "Ingebouwde schakelaar: " + this.keyToHtml("bool3", this.has_ingebouwde_schakelaar) + ", ";
        output += "Noodverlichting: " + this.selectToHtml("select2", this.noodverlichting, ["Geen", "Centraal", "Decentraal"]);
        output += ", Adres/tekst: " + this.keyToHtml("commentaar", this.commentaar, 5);

        return output;
    }
}

