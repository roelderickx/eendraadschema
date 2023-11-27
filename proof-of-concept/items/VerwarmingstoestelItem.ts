class VerwarmingstoestelItem extends ElectroBaseItem {
    private is_accumulatie: boolean; // 3
    private has_ventilator: boolean; // 6
    
    public initialize() {
        super.initialize();

        this.type = "Verwarmingstoestel";
        this.is_accumulatie = false;
        this.has_ventilator = false;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.is_accumulatie = json_keys['accumulatie'];
        this.has_ventilator = json_keys['ventilator'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5);
        output += ", Accumulatie: " + this.keyToHtml("accumulatie", this.is_accumulatie);
        if (this.is_accumulatie) {
            output += ", Ventilator: " + this.keyToHtml("ventilator", this.has_ventilator);
        }
        output += ", Adres/tekst: " + this.keyToHtml("commentaar", this.commentaar, 5);

        return output;
    }
}

