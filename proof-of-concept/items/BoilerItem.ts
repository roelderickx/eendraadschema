class BoilerItem extends ElectroBaseItem {
    private accumulatie: boolean;
    
    public initialize() {
        super.initialize();

        this.type = "Boiler";
        this.accumulatie = false;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.accumulatie = json_keys['accumulatie'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5) + ", ";
        output += "Accumulatie: " + this.keyToHtml("accumulatie", this.accumulatie);
        output += ", Adres/tekst: " + this.keyToHtml("commentaar", this.commentaar, 5);

        return output;
    }
}

