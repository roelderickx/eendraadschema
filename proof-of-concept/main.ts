// main

var eendraadschema = new EendraadschemaTree();
eendraadschema.load_eds("../build/examples/example001.eds");
console.log(`
<!DOCTYPE html>
<html>
  <head>
    <script src="prop/prop_scripts.js"></script>
    <script src="builddate.js"></script>
    <script src="pako/pako.min.js"></script>
    <link rel="stylesheet" href="css/styles.css">
    <title>Eendraadschema online tekenen</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="keywords" content="Eendraadschema, online, tekenen, svg, gratis">
    <meta name="description" content="Een tool om ééndraadschema’s te tekenen">
    <meta name="author" content="Ivan Goethals">
    <style type="text/css" media="print">
      @page {
        size: landscape;
      }
    </style>
  </head>
  <body>
    <div id="topmenu">
      <ul id="minitabs">
        <!--<li><a href="#">Thuis</a></li>-->
        <li><a href="javascript:restart_all()">Nieuw</a></li>
        <li><a href="javascript:HLRedrawTree()">Bewerken</a></li>
        <li><a href="javascript:importclicked()">Openen</a></li>
        <li><a href="javascript:exportscreen()">Opslaan</a></li>
        <li><a href="javascript:printsvg()">Print</a></li>
        <li><a href="Documentation/edsdoc.pdf" target="_blank">Documentatie</a></li>
        <li><a href="javascript:openContactForm()">Info/Contact</a></li>
      </ul>
    </div>
    <div id="configsection">
    </div>
    <div id="canvas_2col">
      <div id="left_col">
        <div id="left_col_inner">`);
console.log(eendraadschema.to_html("edit"));
console.log(`</div>
      </div>
      <div id="right_col">
        <div id="right_col_inner">`);
console.log(eendraadschema.to_svg());
console.log(`</div>
      </div>
    </div>
    <input id="importfile" type="file" accept=".eds" onchange="importjson(event)" style="display:none;" >
    <script src="eendraadschema.min.js"></script>
  </body>
</html>

<!-- <div id="left_col_inner" style="overflow-x: scroll; white-space: nowrap;"></div> -->`);

