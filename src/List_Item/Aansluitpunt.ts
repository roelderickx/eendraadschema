class Aansluitpunt extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Aansluitpunt";
        this.props.adres = "";
    } 

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Nr: " + this.stringPropToHTML('nr',5);
        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 29;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
                   +  '<use xlink:href="#aansluitpunt" x="21" y="25"></use>';
        
        mySVG.data += this.addAddressToSVG(mySVG,45,0);
        mySVG.data += "\n";

        return(mySVG);
    }

}