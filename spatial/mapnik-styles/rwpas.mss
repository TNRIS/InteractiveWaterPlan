Map {
  background-color: transparent;
}

.rwpas {
  polygon-opacity:1;
  polygon-fill:#ae8;

  [LETTER = "A"] { polygon-fill: rgb(116, 196, 118); }
  [LETTER = "B"] { polygon-fill: rgb(0, 169, 230); }
  [LETTER = "C"] {
    polygon-fill: rgb(40, 79, 176);
    text-fill: #cfdcff;
  }
  [LETTER = "D"] { polygon-fill: rgb(102, 119, 205); }
  [LETTER = "E"] { polygon-fill: rgb(161, 217, 155); }
  [LETTER = "F"] { polygon-fill: rgb(198, 219, 239); }
  [LETTER = "G"] { polygon-fill: rgb(224, 243, 219); }
  [LETTER = "H"] { polygon-fill: rgb(102, 153, 205); }
  [LETTER = "I"] { polygon-fill: rgb(168, 221, 181); }
  [LETTER = "J"] { polygon-fill: rgb(64, 93, 189); }
  [LETTER = "K"] { polygon-fill: rgb(108, 125, 212); }
  [LETTER = "L"] { polygon-fill: rgb(204, 235, 197); }
  [LETTER = "M"] {
    polygon-fill: rgb(9, 62, 153);
 	text-fill: #cfdcff;
  }
  [LETTER = "N"] { polygon-fill: rgb(195, 197, 247); }
  [LETTER = "O"] { polygon-fill: rgb(0, 132, 168); }
  [LETTER = "P"] {
    polygon-fill: rgb(8, 104, 172);
   	text-fill: #cfdcff;
  }

  text-face-name: 'Open Sans Regular';
  text-fill: #036;
  text-size: 20;
  text-name: '';

  [zoom>4] {
	  text-name: [LETTER];
  }
  [zoom>7] {
	  text-name: 'Region ' + [LETTER];
	  text-wrap-width: 1;
	  text-wrap-character: '_';
  }
}
