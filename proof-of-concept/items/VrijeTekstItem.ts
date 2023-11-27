class VrijeTekstItem extends ElectroBaseItem {
    private vrij_type: string; // 16
    private horizontale_align: string; // 17
    private is_vet: boolean; // 19
    private is_schuin: boolean; // 20
    private breedte: number; // 22
    private tekst: string; //23
    
    public initialize() {
        super.initialize();

        this.type = "Vrije tekst";
        this.vrij_type = "";
        this.horizontale_align = "";
        this.is_vet = false;
        this.is_schuin = false;
        this.breedte = null;
        this.tekst = "";
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.vrij_type = json_keys['select1'];
        this.horizontale_align = json_keys['select2'];
        this.is_vet = json_keys['bool1'];
        this.is_schuin = json_keys['bool2'];
        this.breedte = json_keys['string1'];
        this.tekst = json_keys['string2'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5);
        output += ", Tekst (nieuwe lijn = \"|\"): " + this.keyToHtml("commentaar", this.commentaar, 10);
        output += ", Type: " + this.selectToHtml("select1", this.vrij_type, ["", "verbruiker", "zonder kader"]);
        output += ", Horizontale alignering: " + this.selectToHtml("select2", this.horizontale_align, ["links", "centreer", "rechts"]);
        output += ", Vet: " + this.keyToHtml("bool1", this.is_vet);
        output += ", Schuin: " + this.keyToHtml("bool2", this.is_schuin);
        output += ", Breedte: " + this.keyToHtml("string1", this.breedte, 3);
        if (this.vrij_type != "zonder kader") output += ", Adres/tekst: " + this.keyToHtml("string2", this.tekst, 2);

        return output;
    }
}

