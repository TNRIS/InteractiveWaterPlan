Map {
  background-color: transparent;
}

#counties-labels {
  text-face-name: 'open sans regular';
  text-fill: #333;
  text-size: 10;
  text-name: '';
  text-halo-fill: fadeout(white, 30%);
  text-halo-radius: 2.5;

  [zoom>7] {
	  text-name: [county];
  }
  [zoom>8] {
    text-size: 12;
  }
  [zoom>9] {
    text-size: 15;
  }
  [zoom>9] {
    text-size: 20;
  }
}

