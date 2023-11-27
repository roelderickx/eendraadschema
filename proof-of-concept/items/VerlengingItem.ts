class VerlengingItem extends ElectroBaseItem {
    private breedte: number; // 22
    private tekst: string; //23
    
    public initialize() {
        super.initialize();

        this.type = "Verlenging";
        this.breedte = null;
        this.tekst = "";
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.breedte = json_keys['string1'];
        this.tekst = json_keys['string2'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5);
        output += ", Breedte: " + this.keyToHtml("string1", this.breedte, 3);
        output += ", Adres/tekst: " + this.keyToHtml("string2", this.tekst, 2);

        return output;
    }
}

