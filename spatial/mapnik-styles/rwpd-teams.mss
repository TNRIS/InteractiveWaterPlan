Map {
  background-color: transparent;
}

#rwpd-teams {
  text-face-name: 'Open Sans Regular';
  text-name: '';
  text-fill: #333;
  text-size: 30;
  text-halo-fill: fadeout(white, 30%);
  text-halo-radius: 2.5;
  polygon-fill: transparent;


  ::line {
  	line-width: 3;
  	line-color: #666;
  }

  [zoom>=6] {
	  text-name: [Team];
	  line-width: 2.5;
      line-color: fadeout(white, 30%);
  }

  [zoom>=7] {
      text-size: 40;
  }

  [zoom>=8] {
      text-size: 50;
  }
}
