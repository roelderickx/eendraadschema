class RootItem extends ElectroBaseItem {
    constructor() {
        // top node always has id 0
        super(0);
    }
    
    public initialize() {
        super.initialize();

        this.type = "root";
    }
    
    protected get_consumers_of_children() : Array<string> {
        return ["", "Kring", "Aansluiting"];
    }
    
    public get_max_children() : number {
        return 256;
    }
    
    protected can_insert_after_for_children() : boolean {
        return true;
    }
    
    public can_insert_after() : boolean {
        return false;
    }
    
    public to_html(mode: string) : string {
        var output: string = "";
        
        //-- bovenaan de switch van editeer-mode (teken of verplaats) --
        switch (mode) {
        case "edit":
            output += 'Modus (Invoegen/Verplaatsen/Clone) <select id="edit_mode" onchange="HL_editmode()"><option value="edit" selected>Invoegen</option><option value="move">Verplaatsen/Clone</option></select><br><br>';
            break;
        case "move":
            output += 'Modus (Invoegen/Verplaatsen/Clone) <select id="edit_mode" onchange="HL_editmode()"><option value="edit">Invoegen</option><option value="move" selected>Verplaatsen/Clone</option></select>' +
                '<span style="color:black"><i>&nbsp;Gebruik de pijlen om de volgorde van elementen te wijzigen. ' +
                'Gebruik het Moeder-veld om een component elders in het schema te hangen. Kies "clone" om een dubbel te maken van een element.</i></span><br><br>';
            break;
        }

        //-- plaats input box voor naam van het schema bovenaan --
        //output += 'Bestandsnaam: <span id="settings"><code>' + this.properties.filename + '</code>&nbsp;<button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button></span><br><br>'

        var active_child_exists: boolean = false;
        for (var child of this.children) {
            if (child.is_active) {
                output += child.to_html(mode);
                active_child_exists = true;
            }
        }
        
        if (!active_child_exists) {
            //no need for the add button if we have items
            output += "<button onclick=\"HLAdd()\">Voeg eerste object toe of kies bovenaan \"Nieuw\"</button><br>";
        }
        
        return output;
    }
}

