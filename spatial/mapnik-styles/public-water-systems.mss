Map {
  background-color: transparent;
}

#publicwatersystems {
  ::fill {
    polygon-fill: #ffe9c6;
  }
  ::outline {
    line-color: #f09d0d;
    line-width: 1;
    line-join: round;
  }
  ::label{
    [zoom > 10] {
 	  text-face-name: 'Open Sans Regular';
 	  text-fill: #333;
  	  text-size: 10;
 	  text-halo-fill: fadeout(white, 30%);
  	  text-halo-radius: 2.5;
      text-name: [A1NAME];
  	  text-wrap-width: 40;
    }
  }
}
