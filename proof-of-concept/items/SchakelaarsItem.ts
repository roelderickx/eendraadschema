class SchakelaarsItem extends ElectroBaseItem {
    private aantal: number; // 4
    private lichtkring_poligheid: string; // 5
    private has_signalisatielamp: boolean; // 19
    private is_halfwaterdicht: boolean; // 20
    private has_verklikker: boolean; // 21
    private is_trekschakelaar: boolean; // 19
    
    public initialize() {
        super.initialize();

        this.type = "Schakelaars";
        this.aantal = 1;
        this.lichtkring_poligheid = "enkelpolig";
        this.has_signalisatielamp = false;
        this.is_halfwaterdicht = false;
        this.has_verklikker = false;
        this.is_trekschakelaar = false;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.aantal = json_keys['aantal'];
        this.lichtkring_poligheid = json_keys['lichtkring_poligheid'];
        this.has_signalisatielamp = json_keys['bool1'];
        this.is_halfwaterdicht = json_keys['bool2'];
        this.has_verklikker = json_keys['bool3'];
        this.is_trekschakelaar = json_keys['bool4'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5);
        output += ", " + this.selectToHtml("lichtkring_poligheid", this.lichtkring_poligheid, ["enkelpolig", "dubbelpolig", "driepolig", "dubbelaansteking", "wissel_enkel", "wissel_dubbel", "kruis_enkel", "---", "schakelaar", "dimschakelaar", "dimschakelaar wissel", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat", "rolluikschakelaar"]);

        if ( (this.lichtkring_poligheid == "enkelpolig") ||
             (this.lichtkring_poligheid == "dubbelpolig") ||
             (this.lichtkring_poligheid == "driepolig") ||
             (this.lichtkring_poligheid == "kruis_enkel") ||
             (this.lichtkring_poligheid == "dubbelaansteking") ||
             (this.lichtkring_poligheid == "wissel_enkel") ||
             (this.lichtkring_poligheid == "wissel_dubbel") ||
             (this.lichtkring_poligheid == "dubbel") ||
             (this.lichtkring_poligheid == "dimschakelaar") ||
             (this.lichtkring_poligheid == "dimschakelaar wissel") ||
             (this.lichtkring_poligheid == "rolluikschakelaar") )
        {
            output += ", Halfwaterdicht: " + this.keyToHtml("bool2", this.is_halfwaterdicht);
        }

        if ( (this.lichtkring_poligheid == "enkelpolig") ||
             (this.lichtkring_poligheid == "dubbelpolig") ||
             (this.lichtkring_poligheid == "driepolig") ||
             (this.lichtkring_poligheid == "kruis_enkel") ||
             (this.lichtkring_poligheid == "dubbelaansteking") ||
             (this.lichtkring_poligheid == "wissel_enkel") ||
             (this.lichtkring_poligheid == "wissel_dubbel") ||
             (this.lichtkring_poligheid == "dubbel") ||
             (this.lichtkring_poligheid == "dimschakelaar") ||
             (this.lichtkring_poligheid == "dimschakelaar wissel") )
        {
            output += ", Verklikkerlampje: " + this.keyToHtml("bool3", this.has_verklikker);
            output += ", Signalisatielampje: " + this.keyToHtml("bool1", this.has_signalisatielamp);
            if ( (this.lichtkring_poligheid != "dimschakelaar") &&
                 (this.lichtkring_poligheid != "dimschakelaar wissel") )
            {
                output += ", Trekschakelaar: " + this.keyToHtml("bool4", this.is_trekschakelaar);
            }
        }
        switch (this.lichtkring_poligheid) {
        case "enkelpolig":
            output += ", Aantal schakelaars: " + this.selectToHtml("aantal", this.aantal, ["1", "2", "3", "4", "5"]);
            break;
        case "dubbelpolig":
            output += ", Aantal schakelaars: " + this.selectToHtml("aantal", this.aantal, ["1", "2"]);
            break;
        }
        output += ", Adres/tekst: " + this.keyToHtml("commentaar", this.commentaar, 5);

        return output;
    }
}

