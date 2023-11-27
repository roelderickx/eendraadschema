class TransformatorItem extends ElectroBaseItem {
    private voltage: string; // 14
    
    public initialize() {
        super.initialize();

        this.type = "Transformator";
        this.voltage = "230V/24V";
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.voltage = json_keys['voltage'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5);
        output += ", Voltage: " + this.keyToHtml("voltage", this.voltage, 8);
        output += ", Adres/tekst: " + this.keyToHtml("commentaar", this.commentaar, 5);

        return output;
    }
}

