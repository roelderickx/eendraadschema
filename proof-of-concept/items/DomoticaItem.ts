class DomoticaItem extends ElectroBaseItem {
    public initialize() {
        super.initialize();

        this.type = "Domotica";
    }

    protected get_consumers_of_children() : Array<string> {
        return ["", "Kring"];
    }
    
    protected get_max_children_for_children() : number {
        return 0;
    }
    
    public get_max_children() : number {
        return 256;
    }
    
    protected can_insert_after_for_children() : boolean {
        return true;
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5);
        output += ", Tekst: " + this.keyToHtml("commentaar", this.commentaar, 10);

        return output;
    }
}

