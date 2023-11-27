class BordItem extends ElectroBaseItem {
    private geaard: boolean; // 1
    
    public initialize() {
        super.initialize();

        this.type = "Bord";
        this.geaard = true;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.geaard = json_keys['geaard'];
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
        
        output += "&nbsp;Naam: " + this.keyToHtml("naam", this.naam, 5) + ", ";
        output += "Geaard: " + this.keyToHtml("geaard", this.geaard);
        
        return output;
    }
}

