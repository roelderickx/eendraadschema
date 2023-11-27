class ZeldzameSymbolenItem extends ElectroBaseItem {
    private symbool: string;
    
    public initialize() {
        super.initialize();

        this.type = "Zeldzame symbolen";
        this.symbool = "";
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.symbool = json_keys['select1'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5);
        output += ", Symbool: " + this.selectToHtml("select1", this.symbool, ["", "deurslot"]);
        output += ", Adres/tekst: " + this.keyToHtml("commentaar", this.commentaar, 5);

        return output;
    }
}

