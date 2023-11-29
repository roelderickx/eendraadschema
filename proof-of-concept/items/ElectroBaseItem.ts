// Abstract base class for all items
abstract class ElectroBaseItem {
    public id: number;
    public parent: ElectroBaseItem;
    public children: Array<ElectroBaseItem>;
    // item properties
    public type: string;
    public is_active: boolean;
    public is_collapsed: boolean;
    public naam: string; // 10
    public commentaar: string; // 15
    
    constructor(item_id: number) {
        this.id = item_id;
        this.parent = null;
        this.children = new Array<ElectroBaseItem>();
        
        this.initialize();
    }
    
    public initialize() {
        this.type = "";
        this.is_active = true;
        this.is_collapsed = false;
        this.naam = "";
        this.commentaar = "";
    }

    public load_eds_v1_item(json_keys: Record<string, any>) {
        this.is_active = json_keys['active'];
        this.naam = json_keys['naam'];
        this.commentaar = json_keys['commentaar'];
    }

    public load_eds_v2_item(json_item) {
        // To be defined
    }

    // Searches the item corresponding to parent_id and adds the child below the found item
    public append_item(parent_id, child_item) : boolean {
        if (this.id == parent_id) {
            child_item.parent = this;
            this.children.push(child_item);
            return true;
        } else {
            for (var child of this.children) {
                if (child.append_item(parent_id, child_item)) {
                    return true;
                }
            }
            return false;
        }
    }
    
    protected get_consumers_of_children() : Array<string> {
        return ["", "Aansluiting", "Domotica", "Domotica gestuurde verbruiker", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Omvormer", "Overspanningsbeveiliging", "Microgolfoven", "Motor", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
    }

    // -- When called, this one ensures we cannot have a child that doesn't align with its parent --
    public get_consumers() : Array<string> {
        return this.parent.get_consumers_of_children(); // by default this depends on the parent
    }

    // children of this item are by default constraint to 1 child
    protected get_max_children_for_children() : number {
        return 1;
    }

    // Returns the amount of children allowed
    public get_max_children() : number {
        return this.parent.get_max_children_for_children(); // by default this depends on the parent
    }
    
    //-- Returns true if the Electro_Item can have childs in case it is or
    //   will become a child of Parent --
    public can_insert_child() : boolean {
        // Checks if the insert after button should be displayed or not
        return (this.get_max_children() > 0);
    }
    
    protected can_insert_after_for_children() : boolean {
        return false;
    }
    
    //-- Checks if the insert after button should be displayed or not in case the
    //   element is or will become a child of Parent --
    public can_insert_after() : boolean {
        return this.parent.can_insert_after_for_children(); // by default this depends on the parent
    }

    // prints the hierarchical list to the console for debugging purposes
    // output does not contain any item properties
    public to_stdout(indent: number = 0) {
        var indent_string: string = "";
        for (var i: number = 0; i < indent; i++) {
            indent_string += " ";
        }
        console.log(indent_string + this.id + ": " + Object.getPrototypeOf(this).constructor.name)

        for (var child of this.children) {
            child.to_stdout(indent+2);
        }
    }
    
    // helper function to export item properties to html, as textfield or checkbox
    protected keyToHtml(key_name: string, key_value: any, size?: number) {
        const hl_id: string = 'HL_edit_' + this.id + "_" + key_name;
        let output: string = '<input ';
        
        if (typeof key_value == "boolean") {
            output +=
                'type="checkbox" ' +
                'id="' + hl_id + '" ' +
                'onchange=HLUpdate(' + this.id + ',"' + key_name + '","BOOLEAN","' + hl_id + '") ' +
                'value="' + key_value + '" ' +
                (key_value ? 'checked ' : ' ') +
                '>';
        } else {
            output +=
                'type="text" ' +
                (size == null ? '' : 'size="' + size + '" ') +
                'id="' + hl_id + '" ' +
                'onchange=HLUpdate(' + this.id + ',"' + key_name + '","STRING","' + hl_id + '") ' +
                'value="' + key_value + '">';
        }
        
        return (output);
    }

    // helper function to export item properties to html, as selectlist
    protected selectToHtml(key_name: string, key_value: any, items: Array<string>) {
        const hl_id: string = 'HL_edit_' + this.id + "_" + key_name;
        var output: string = '<select ';

        output +=
            'id="' + hl_id + '" ' +
            'onchange=HLUpdate(' + this.id + ',"' + key_name + '","SELECT","' + hl_id + '")>';
        
        for (var item of items) {
            var options = "";
            if (item == "---") {
                options += " disabled";
                item = "---------------------------";
            } else if (item == "-") {
                options += " disabled";
                item = "---";
            } else if (key_value == item) {
                options += " selected";
            }
            output += '<option value="' + item + '"' + options + '>' + item + '</option>';
        }
        
        output += "</select>"

        return (output);
    }
    
    // overridable function to export the item properties to html
    protected properties_to_html() : string {
        return this.selectToHtml("type", this.type, this.get_consumers());
    }

    // export the item as html
    public to_html(mode: string) : string {
        let output: string = "";
        
        if (this.is_collapsed) {
            output += '<table class="html_edit_table"><tr><td bgcolor="#8AB2E4" onclick="HLCollapseExpand(' + this.id + ')" valign= "top">&#x229E;</td><td width="100%">'
        } else {
            output += '<table class="html_edit_table"><tr><td bgcolor="#C0C0C0" onclick="HLCollapseExpand(' + this.id + ')" valign= "top">&#x229F;</td><td width="100%">'
        }

        if (mode == "move") {
            output += "<b>ID: "+this.id+"</b>, ";
            output += 'Moeder: <input id="id_parent_change_' + this.id + '" type="text" size="2" value="' + this.parent.id + '" onchange="HL_changeparent(' + this.id + ')"> ';
            output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveUp(" + this.id +")\">&#9650;</button>";
            output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveDown(" + this.id +")\">&#9660;</button>";
            if (this.can_insert_after()) {
                output += " <button style=\"background-color:lightblue;\" onclick=\"HLClone(" + this.id +")\">Clone</button>";
            }
        } else {
            if (this.can_insert_after()) {
                output += " <button style=\"background-color:green;\" onclick=\"HLInsertBefore(" + this.id +")\">&#9650;</button>";
                output += " <button style=\"background-color:green;\" onclick=\"HLInsertAfter(" + this.id +")\">&#9660;</button>";
            }
            if (this.can_insert_child()) {
                output += " <button style=\"background-color:green;\" onclick=\"HLInsertChild(" + this.id +")\">&#9654;</button>";
            }
        }
        output += " <button style=\"background-color:red;\" onclick=\"HLDelete(" + this.id +")\">&#9851;</button>";
        output += "&nbsp;"
        
        output += this.properties_to_html();

        if (!this.is_collapsed) {
            for (var child of this.children) {
                output += child.to_html(mode);
            }
        }

        output += "</td></tr></table>";
        
        return output;
    }
    
    //-- Add the addressline below --
    // default values were starty=60, godown=15, shiftx=0, tekst=this.commentaar
    protected svg_add_address(mySVG: SVGelement, starty: number, godown: number, shiftx: number, tekst: string) : string {
        let returnstr:string = "";
        if (!(/^\s*$/.test(tekst))) { //check if adres contains only white space
          returnstr = '<text x="' + ((mySVG.xright-20)/2 + 21 + shiftx) + '" y="' + starty + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(tekst) + '</text>';
          mySVG.ydown = mySVG.ydown + godown;
        }
        return returnstr;
    }
    
    // export the item as svg
    public to_svg() : SVGelement {
        let mySVG:SVGelement = new SVGelement();
        return mySVG;
    }
}

