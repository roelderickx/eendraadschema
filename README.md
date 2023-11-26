# Eendraadschema tekenen -- Drawing a one-wire diagram

## Purpose

Design and draw a one-wire diagram as enforced by the Belgian AREI legislation.
Source code written in Typescript, transpiled to Javascript and run in a browser.

Present files are a standalone copy of the online version found at [https://eendraadschema.goethals-jacobs.be](https://eendraadschema.goethals-jacobs.be).
Note that some limited functionalities will not be available in the standalone version.
We refer to the online version if you whish to use this tool in a production setting.

## License

Copyright (C) 2019-2023  Ivan Goethals

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

Licenses for embedded content

- This program uses the Pako.js entropy coding library. Pako is released under an MIT license by Andrey Tupitsin and Vitaly Puzrin. For more information on Pako and the full license text, please visit [https://github.com/nodeca/pako](https://github.com/nodeca/pako)
- Pako implements ZLib in javascript. Zlib is released under the ZLIB License.  See [https://www.zlib.net/zlib_license.html](https://www.zlib.net/zlib_license.html)

## History

Software developed by Ivan Goethals between as of March 2019.
Placed on Github as-is on June 1st 2020 and further developed on Github.

## Build / Compile

Below description is valid for a linux terminal with bash- or sh-shell.
With some extra tweaks, compilation on other systems should be possible as well.

- Extract all files and directories in a dedicated folder.
- Ensure you have a typescript compiler installed that can be called by the name "tsc"
- Ensure you have uglifyjs installed
- Run the ./compile -script from the dedicated folder.
- Change to the build folder and open index.html with a modern browser

## Further development

The eendraadschema software is, and has been used by various hobbyists on the Belgian
market. As such it is important that the software remains backwards compatible with
all earlier generated EDS-files.

Given that exports- and imports- of the schematics (EDS-file) are basically
json-dumps of internal data-structures, until further notice, this entails the following:
- No fundamental changes can be allowed to the data-model underlying the hierarchical trees that can be
  drawn with the software, as embedded in the Hierarchical_List -class.
- No fundamental changes can be allowed to the Electro_Item -class constructor. Especially the order of the
  keys must be maintained. If new future features require an extension of the number of available keys,
  extra keys should be added at the end.

