class WarmtepompAircoItem extends ElectroBaseItem {
    private aantal: number; // 4
    private warmte_functie: string; // 18
    
    public initialize() {
        super.initialize();

        this.type = "Warmtepomp/airco";
        this.aantal = 1;
        this.warmte_functie = "";
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.aantal = json_keys['aantal'];
        this.warmte_functie = json_keys['select3'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5);
        output += ", Warmte functie: " + this.selectToHtml("select3", this.warmte_functie, ["", "Koelend", "Verwarmend", "Verwarmend en koelend"]);
        output += ", Aantal: " + this.selectToHtml("aantal", this.aantal, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]);
        output += ", Adres/tekst: " + this.keyToHtml("commentaar", this.commentaar, 5);

        return output;
    }
}

