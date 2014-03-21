Map {
  background-color: transparent;
}

#counties-outlines {
  ::case {
 	[zoom>6] {
	  line-width: 2.5;
      line-color: fadeout(white, 30%);
  	}
  }
  ::line {
  	line-width: 1.5;
  	line-color: #333;
  }
  polygon-fill: transparent;
}
