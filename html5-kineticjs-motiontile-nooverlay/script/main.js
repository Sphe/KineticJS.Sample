var board = mainBoardObject();
board.display();

 setInterval(function() {
	 board.motionTile();
	 board.display();
 }, 10000);