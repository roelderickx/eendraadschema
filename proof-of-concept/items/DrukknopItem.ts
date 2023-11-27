class DrukknopItem extends ElectroBaseItem {
    private aantal_armaturen: number; // 4
    private aantal_knoppen: number; // 13
    private type_drukknop: string; // 16
    private is_afgeschermd: boolean; // 19
    private is_halfwaterdicht: boolean; // 20
    private has_verklikkerlampje: boolean; // 21
    
    public initialize() {
        super.initialize();

        this.type = "Drukknop";
        this.aantal_armaturen = 1;
        this.aantal_knoppen = 1;
        this.type_drukknop = "";
        this.is_afgeschermd = false;
        this.is_halfwaterdicht = false;
        this.has_verklikkerlampje = false;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.aantal_armaturen = json_keys['aantal'];
        this.aantal_knoppen = json_keys['aantal2'];
        this.type_drukknop = json_keys['select1'];
        this.is_afgeschermd = json_keys['bool1'];
        this.is_halfwaterdicht = json_keys['bool2'];
        this.has_verklikkerlampje = json_keys['bool3'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5);
        output += ", Type: " + this.selectToHtml("select1", this.type_drukknop, ["standaard", "dimmer", "rolluik"]);
        output += ", Verklikkerlampje: " + this.keyToHtml("bool3", this.has_verklikkerlampje);
        output += ", Halfwaterdicht: " + this.keyToHtml("bool2", this.is_halfwaterdicht);
        output += ", Afgeschermd: " + this.keyToHtml("bool1", this.is_afgeschermd);
        output += ", Aantal armaturen: " + this.selectToHtml("aantal", this.aantal_armaturen, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]);
        output += ", Aantal knoppen per armatuur: " + this.selectToHtml("aantal2", this.aantal_knoppen, ["1", "2", "3", "4", "5", "6", "7", "8"]);
        output += ", Adres/tekst: " + this.keyToHtml("commentaar", this.commentaar, 5);

        return output;
    }
}

