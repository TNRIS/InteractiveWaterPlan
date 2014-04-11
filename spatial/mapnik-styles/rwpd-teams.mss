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

  line-color: #666;
  line-width: 1.5;

  [zoom>=5] {
	  text-name: [Team];
      text-size: 20;
  }

  [zoom>=6] {
      text-size: 30;
  }

  [zoom>=7] {
      text-size: 40;
	  line-width: 2;
  }

  [zoom>=8] {
      text-size: 50;
   	  line-width: 3;

  }
}
