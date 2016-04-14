function restartGame(){
    sokoban.restart();
}

var Sokoban = function(boxContext,width,height) {
    this.context = boxContext;
    this.width = width;
    this.height = height;
    this.curLoc = {x:8,y:3};
    this.targetLoc = [{x:1,y:3},{x:1,y:4},{x:2,y:2},{x:2,y:3},{x:2,y:4}];
    this.imgArray = [new Image(),new Image(),new Image(),new Image(),new Image()];
    //0表示无，1表示隔离，2表示空地，3表示目标，4表示箱子，5表示当前位置
    this.cellArray = [[0,0,0,1,1,1,1,1,1,0],
                      [0,1,1,1,2,2,2,2,1,0],
                      [1,1,3,2,4,1,1,2,1,1],
                      [1,3,3,4,2,4,2,2,5,1],
                      [1,3,3,2,4,2,4,2,1,1],
                      [1,1,1,1,1,1,2,2,1,0],
                      [0,0,0,0,0,1,1,1,1,0]];
}

Sokoban.prototype = {
    fillCell : function(type,x,y){
        var cellWidth = this.width/this.cellArray[0].length;
        var cellHeight = this.height/this.cellArray.length;
        switch(type){
            case 0: this.context.save();
                    this.context.clearRect(cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    this.context.fillStyle = '#000';
                    this.context.fillRect(cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    this.context.restore();
                    break;
            case 1: 
                    this.context.save();
                    this.context.clearRect(cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    var ptn = this.context.createPattern(this.imgArray[0],"repeat");
                    this.context.fillStyle = ptn; 
                    this.context.fillRect(cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    this.context.restore();
                    break;
            case 2: this.context.save();
                    this.context.clearRect(cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    this.context.fillStyle = this.context.createPattern(this.imgArray[1],"repeat"); 
                    this.context.fillRect(cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    this.context.restore();
                    break;
            case 3: this.context.save();
                    this.context.clearRect(cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    this.context.fillStyle = this.context.createPattern(this.imgArray[1],"repeat"); 
                    this.context.fillRect(cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    this.context.drawImage(this.imgArray[2],cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    this.context.restore();                    
                    break;
            case 4: this.context.save();
                    this.context.clearRect(cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    this.context.fillStyle = this.context.createPattern(this.imgArray[1],"repeat"); 
                    this.context.fillRect(cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    this.context.drawImage(this.imgArray[3],cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    this.context.restore();                    
                    break;
            case 5: this.context.save();
                    this.context.clearRect(cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    this.context.fillStyle = this.context.createPattern(this.imgArray[1],"repeat"); 
                    this.context.fillRect(cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    this.context.drawImage(this.imgArray[4],cellWidth*x,cellHeight*y,cellWidth,cellHeight);
                    this.context.restore();                    
                    break;
        }
    },
    prepareImage : function(callback){
        var imgSrcArray = ['../../../img/2016-04-14/1.png','../../../img/2016-04-14/2.png','../../../img/2016-04-14/3.png','../../../img/2016-04-14/4.png','../../../img/2016-04-14/5.png'];
        var that = this;
        for(var i=0,len=this.imgArray.length,loading=len-1;i<5;i++){
            this.imgArray[i].src = imgSrcArray[i];
            this.imgArray[i].onload = function(){
                len--;
                if(!len){
                    callback.call(that);
                    window.onkeydown = function(e){
                        that.action(e.keyIdentifier.toLowerCase());
                    };
                }
            };
        }
    },
    paintCells : function(){
        //0表示无，1表示隔离，2表示空地，3表示目标，4表示箱子，5表示当前位置
        for(var i=0,w=this.cellArray[0].length,h=this.cellArray.length;i<h;i++){
            for(var j=0;j<w;j++){
                this.fillCell(this.cellArray[i][j],j,i);
            }
        }
    },
    init : function(){
        this.prepareImage(this.paintCells);
    },
    action : function(direction){
        var nextLoc = {};
        switch(direction){
            case 'up': 
                nextLoc.type = this.cellArray[this.curLoc.y-1][this.curLoc.x];
                nextLoc.x = this.curLoc.x;
                nextLoc.y = this.curLoc.y-1;
                if( nextLoc.type == 2 || nextLoc.type == 3){
                    this.move(nextLoc);
                    this.paintCells();
                }else if( nextLoc.type == 4 && this.cellArray[this.curLoc.y-2][this.curLoc.x] == 2 || this.cellArray[this.curLoc.y-2][this.curLoc.x] == 3){
                    this.pushBox(nextLoc.x,nextLoc.y-1);
                    this.move(nextLoc);
                    this.paintCells();
                }
                this.checkResult();
                break;
            case 'down': 
                nextLoc.type = this.cellArray[this.curLoc.y+1][this.curLoc.x];
                nextLoc.x = this.curLoc.x;
                nextLoc.y = this.curLoc.y+1;
                if( nextLoc.type == 2 || nextLoc.type == 3){
                    this.move(nextLoc);
                    this.paintCells();
                }else if( nextLoc.type == 4 && this.cellArray[this.curLoc.y+2][this.curLoc.x] == 2 || this.cellArray[this.curLoc.y+2][this.curLoc.x] == 3){
                    this.pushBox(nextLoc.x,nextLoc.y+1);
                    this.move(nextLoc);
                    this.paintCells();
                }
                this.checkResult();
                break;
            case 'left': 
                nextLoc.type = this.cellArray[this.curLoc.y][this.curLoc.x-1];
                nextLoc.x = this.curLoc.x-1;
                nextLoc.y = this.curLoc.y;
                if( nextLoc.type == 2 || nextLoc.type == 3){
                    this.move(nextLoc);
                    this.paintCells();
                }else if( nextLoc.type == 4 && this.cellArray[this.curLoc.y][this.curLoc.x-2] == 2 || this.cellArray[this.curLoc.y][this.curLoc.x-2] == 3){
                    this.pushBox(nextLoc.x-1,nextLoc.y);
                    this.move(nextLoc);
                    this.paintCells();
                }
                this.checkResult();
                break;
            case 'right': 
                nextLoc.type = this.cellArray[this.curLoc.y][this.curLoc.x+1];
                nextLoc.x = this.curLoc.x+1;
                nextLoc.y = this.curLoc.y;
                if( nextLoc.type == 2 || nextLoc.type == 3){
                    this.move(nextLoc);
                    this.paintCells();
                }else if( nextLoc.type == 4 && this.cellArray[this.curLoc.y][this.curLoc.x+2] == 2 || this.cellArray[this.curLoc.y][this.curLoc.x+2] == 3){
                    this.pushBox(nextLoc.x+1,nextLoc.y);
                    this.move(nextLoc);
                    this.paintCells();
                }
                this.checkResult();
                break;
            default: break;
        }
    },
    pushBox : function(boxToX,boxToY){
        this.cellArray[boxToY][boxToX] = 4;
    },
    move : function(nextLoc){
        this.cellArray[nextLoc.y][nextLoc.x] = 5;
        this.cellArray[this.curLoc.y][this.curLoc.x] = 2;
        for(var i = this.targetLoc.length -1;  i>=0; i--){
            if(this.targetLoc[i].x == this.curLoc.x && this.targetLoc[i].y == this.curLoc.y){
                this.cellArray[this.curLoc.y][this.curLoc.x] = 3;
            }
        }
        this.curLoc.y = nextLoc.y;
        this.curLoc.x = nextLoc.x;
    },
    checkResult : function(){
        var done = 0, total = this.targetLoc.length;
        for(var i = total -1;  i>=0; i--){
            if(this.cellArray[this.targetLoc[i].y][this.targetLoc[i].x] == 4){
                done++;
            }
        }
        if( done == total ){
            window.onkeydown = null;
            this.context.save();
            this.context.font="40px Verdana";
            this.context.textAlign = "center";
            // 创建渐变
            var gradient=this.context.createLinearGradient(0,0,this.width,this.height);
            gradient.addColorStop("0.3","red");
            gradient.addColorStop("0.5","blue");
            gradient.addColorStop("0.7","yellow");
            // 用渐变填色
            this.context.fillStyle = gradient;
            this.context.fillText("Congratulations!!",this.width/2,this.height/2);
            this.context.restore();
        }
    },
    restart : function(){
        this.curLoc = {x:8,y:3};
        //0表示无，1表示隔离，2表示空地，3表示目标，4表示箱子，5表示当前位置
        this.cellArray = [[0,0,0,1,1,1,1,1,1,0],
                          [0,1,1,1,2,2,2,2,1,0],
                          [1,1,3,2,4,1,1,2,1,1],
                          [1,3,3,4,2,4,2,2,5,1],
                          [1,3,3,2,4,2,4,2,1,1],
                          [1,1,1,1,1,1,2,2,1,0],
                          [0,0,0,0,0,1,1,1,1,0]];
        sokoban.init();
    }
};

var boxCanvas = document.getElementById("boxCanvas");
boxCanvas.width = window.innerWidth  > 1366 ? 640 : window.innerWidth  < 991 ? window.innerWidth * 0.61 : window.innerWidth * 0.45 ;
boxCanvas.height = boxCanvas.width/10*7;
var sokoban = new Sokoban(boxCanvas.getContext('2d'),boxCanvas.width,boxCanvas.height);
sokoban.init();

window.onresize = function(){
    boxCanvas.width = window.innerWidth  > 1366 ? 640 : window.innerWidth  < 991 ? window.innerWidth * 0.61 : window.innerWidth * 0.45 ;
};