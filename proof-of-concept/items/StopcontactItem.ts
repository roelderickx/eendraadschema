class StopcontactItem extends ElectroBaseItem {
    private is_geaard: boolean; // 1
    private has_kinderveiligheid: boolean; // 2
    private aantal: number; // 4
    private aantal_fasen: number; // 16
    private has_ingebouwde_schakelaar: boolean; // 19
    private is_halfwaterdicht: boolean; // 20
    private is_meerfasig: boolean; // 21
    private has_nulgeleider: boolean; // 25
    private in_verdeelbord: boolean; // 26
    
    public initialize() {
        super.initialize();

        this.type = "Stopcontact";
        this.is_geaard = true;
        this.has_kinderveiligheid = true;
        this.aantal = 1;
        this.aantal_fasen = 1;
        this.has_ingebouwde_schakelaar = false;
        this.is_halfwaterdicht = false;
        this.is_meerfasig = false;
        this.has_nulgeleider = false;
        this.in_verdeelbord = false;
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        super.load_eds_v1_item(json_keys);
        this.is_geaard = json_keys['geaard'];
        this.has_kinderveiligheid = json_keys['kinderveiligheid'];
        this.aantal = json_keys['aantal'];
        this.aantal_fasen = json_keys['select1'];
        this.has_ingebouwde_schakelaar = json_keys['bool1'];
        this.is_halfwaterdicht = json_keys['bool2'];
        this.is_meerfasig = json_keys['bool3'];
        this.has_nulgeleider = json_keys['bool4'];
        this.in_verdeelbord = json_keys['bool5'];
    }
    
    protected properties_to_html() : string {
        var output: string = super.properties_to_html();

        output += "&nbsp;Nr: " + this.keyToHtml("naam", this.naam, 5) + ", ";
        output += "Geaard: " + this.keyToHtml("geaard", this.is_geaard) + ", ";
        output += "Kinderveiligheid: " + this.keyToHtml("kinderveiligheid", this.has_kinderveiligheid) + " ";
        output += "Halfwaterdicht: " + this.keyToHtml("bool2", this.is_halfwaterdicht) + ", ";
        output += "Meerfasig: " + this.keyToHtml("bool3", this.is_meerfasig) + ", ";
        if (this.is_meerfasig) {
            output += "Aantal fasen: " + this.selectToHtml("select1", this.aantal_fasen, ["1", "2", "3"]) + ", ";
            output += "Met nul: " + this.keyToHtml("bool4", this.has_nulgeleider) + ", ";
        }
        output += "Ingebouwde schakelaar: " + this.keyToHtml("bool1", this.has_ingebouwde_schakelaar) + ", ";
        output += "Aantal: " + this.selectToHtml("aantal", this.aantal, ["1", "2", "3", "4", "5", "6"]) + ", ";
        output += "In verdeelbord: " + this.keyToHtml("bool5", this.in_verdeelbord);
        output += ", Adres/tekst: " + this.keyToHtml("commentaar", this.commentaar, 5);

        return output;
    }
    
    public to_svg() : SVGelement {
        let mySVG:SVGelement = new SVGelement();
        let outputstr:string = "";

        mySVG.data = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 20;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        var startx: number = 1;
        mySVG.xright = 0;
        if (this.is_meerfasig) { //Meerfasig
          outputstr += '<line x1="1" y1="25" x2="35" y2="25" stroke="black" />';
          startx += 34;
          mySVG.xright += 34;
          switch (this.aantal_fasen) {
            case 1:
              outputstr += '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />';
              break;
            case 2:
              outputstr += '<line x1="16.5" y1="35" x2="22.5" y2="15" stroke="black" />';
              outputstr += '<line x1="22.5" y1="35" x2="28.5" y2="15" stroke="black" />';
              break;
            case 3:
              outputstr += '<line x1="15" y1="35" x2="21" y2="15" stroke="black" />';
              outputstr += '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />';
              outputstr += '<line x1="27" y1="35" x2="33" y2="15" stroke="black" />';
              break;
            default:
              outputstr += '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />';
              break;
          }
          if (this.has_nulgeleider) {
            outputstr += '<line x1="39" y1="35" x2="45" y2="15" stroke="black" />';
            outputstr += '<circle cx="39" cy="35" r="2" fill="black" stroke="black" />';
          }
        }
        if (this.has_ingebouwde_schakelaar) { //Met ingebouwde schakelaar
          outputstr += '<line x1="' + (startx + 0) + '" y1="25" x2="' + (startx + 11) + '" y2="25" stroke="black" />';
          outputstr += '<line x1="' + (startx + 30) + '" y1="25" x2="' + (startx + 20) + '" y2="5" stroke="black" />';
          outputstr += '<line x1="' + (startx + 20) + '" y1="5" x2="' + (startx + 15) + '" y2="7.5" stroke="black" />';
          outputstr += '<line x1="' + (startx + 22) + '" y1="9" x2="' + (startx + 17) + '" y2="11.5" stroke="black" />';
          startx += 10;
          mySVG.xright += 10;
        }
        for (var i = 0; i < this.aantal; i++) {
          outputstr += '<use xlink:href="#stopcontact" x="' + startx + '" y="25"></use>';
          if (this.is_geaard) outputstr += '<use xlink:href="#stopcontact_aarding" x="' + startx + '" y="25"></use>';
          if (this.has_kinderveiligheid) outputstr += '<use xlink:href="#stopcontact_kinderveilig" x="' + startx + '" y="25"></use>';
          startx += 20;
        }
        mySVG.xright += 20 + this.aantal*20;
        //-- Check in verdeelbord --
        if (this.in_verdeelbord) {
          outputstr += '<rect x="' + (mySVG.xright - this.aantal * 20 - 3 - (this.has_ingebouwde_schakelaar ? 12 : 0)) + '" y="3" width="' + (this.aantal*20 + 6 + (this.has_ingebouwde_schakelaar ? 12 : 0)) + '" height="44" fill="none" style="stroke:black" />';
          outputstr += '<line x1="' + (17 + (mySVG.xright-20+3)) + '" y1="3" x2="' + (17 + (mySVG.xright-20+3)) + '" y2="47" fill="none" style="stroke:black" />';
        };  
        //-- check halfwaterdicht--
        if (this.is_halfwaterdicht) outputstr += '<rect x="' + (22+(this.has_ingebouwde_schakelaar ? 10 : 0)+(this.is_meerfasig ? 34 : 0)) + '" y="0" width="6" height="8" style="fill:rgb(255,255,255)" /><text x="' + (25+(this.has_ingebouwde_schakelaar ? 10 : 0)+(this.is_meerfasig ? 34 : 0)) + '" y="8" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
        //-- check any childs? --
        if (this.children.length > 0) {
          outputstr += '<line x1="'+startx+'" y1="25" x2="'+(startx+21)+'" y2="25" stroke="black" />';
        };
        //-- Plaats adres onderaan --
        outputstr += super.svg_add_address(mySVG, 60, 15, 0, this.commentaar);
        
        mySVG.data = outputstr + "\n";
        return mySVG;
    }
}

