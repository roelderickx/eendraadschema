class BelItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Bel";
    }
    
    public get_max_children() : number {
        return 0;
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5);
        output += ", Adres/tekst: " + this.keyToHtml("commentaar", this.commentaar, 5);

        return output;
    }
}

