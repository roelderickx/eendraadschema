class USBLaderItem extends ElectroBaseItem {
    private aantal: number;
    
    public initialize() {
        super.initialize();

        this.type = "USB lader";
        this.aantal = 1;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.aantal = json_keys['aantal'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5);
        output += ", Aantal: " + this.selectToHtml("aantal", this.aantal, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
        output += ", Adres/tekst: " + this.keyToHtml("commentaar", this.commentaar, 5);

        return output;
    }
}

