class StopcontactItem extends ElectroBaseItem {
    private is_geaard: boolean; // 1
    private has_kinderveiligheid: boolean; // 2
    private aantal: number; // 4
    private aantal_fasen: number; // 16
    private has_ingebouwde_schakelaar: boolean; // 19
    private is_halfwaterdicht: boolean; // 20
    private is_meerfasig: boolean; // 21
    private has_nulgeleider: boolean; // 25
    private in_verdeelbord: boolean; // 26
    
    public initialize() {
        super.initialize();

        this.type = "Stopcontact";
        this.is_geaard = true;
        this.has_kinderveiligheid = true;
        this.aantal = 1;
        this.aantal_fasen = 1;
        this.has_ingebouwde_schakelaar = false;
        this.is_halfwaterdicht = false;
        this.is_meerfasig = false;
        this.has_nulgeleider = false;
        this.in_verdeelbord = false;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.is_geaard = json_keys['geaard'];
        this.has_kinderveiligheid = json_keys['kinderveiligheid'];
        this.aantal = json_keys['aantal'];
        this.aantal_fasen = json_keys['select1'];
        this.has_ingebouwde_schakelaar = json_keys['bool1'];
        this.is_halfwaterdicht = json_keys['bool2'];
        this.is_meerfasig = json_keys['bool3'];
        this.has_nulgeleider = json_keys['bool4'];
        this.in_verdeelbord = json_keys['bool5'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5) + ", ";
        output += "Geaard: " + this.keyToHtml("geaard", this.is_geaard) + ", ";
        output += "Kinderveiligheid: " + this.keyToHtml("kinderveiligheid", this.has_kinderveiligheid) + " ";
        output += "Halfwaterdicht: " + this.keyToHtml("bool2", this.is_halfwaterdicht) + ", ";
        output += "Meerfasig: " + this.keyToHtml("bool3", this.is_meerfasig) + ", ";
        if (this.is_meerfasig) {
            output += "Aantal fasen: " + this.selectToHtml("select1", this.aantal_fasen, ["1", "2", "3"]) + ", ";
            output += "Met nul: " + this.keyToHtml("bool4", this.has_nulgeleider) + ", ";
        }
        output += "Ingebouwde schakelaar: " + this.keyToHtml("bool1", this.has_ingebouwde_schakelaar) + ", ";
        output += "Aantal: " + this.selectToHtml("aantal", this.aantal, ["1", "2", "3", "4", "5", "6"]) + ", ";
        output += "In verdeelbord: " + this.keyToHtml("bool5", this.in_verdeelbord);
        output += ", Adres/tekst: " + this.keyToHtml("commentaar", this.commentaar, 5);

        return output;
    }
}

