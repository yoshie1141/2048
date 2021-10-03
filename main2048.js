//主要js

//设定数组存放网格数据
var board = new Array();//此时board为一维数组
//分数
var score = 0;
//阻止一次操作后新生成的数直接和现成的数相加
var hasConflicted=new Array();



$(document).ready(function(){
    newgame();
});

function newgame(){
    
    init();//初始化棋盘格
    
    
    generateOneNumber();
    generateOneNumber();//随机生成两个数
}

function init(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            //gridcell代表每一个小格子
            var gridCell=$('#gridcell-'+i+'-'+j);
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));

        }
    }
    for(var i=0;i<4;i++){
        board[i]=new Array();//遍历数组，每一个i再次生成一个数组，现在board是二维数组
        hasConflicted[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;//初始化
            hasConflicted[i][j]=false;//初始值为false，表示当前位置未发生过碰撞
        }
    }
    updateBoardView();
    score=0;
}


function updateBoardView(){//根据board的值对单元格显示的数值number-cell进行操作,当调用该函数时刷新前端页面的值
    //用户每次操作都会改变board的值，相应的都需要调用本函数
    $(".number-cell").remove();//若该单元格已经存在数值，先删除它，在后面根据当前board值添加新的值
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');//遍历每一个位置都应生成一个number-cell，设置id和clss
            var theNumberCell=$('#number-cell-'+i+'-'+j);//操作当前坐标下number-cell的值

            if(board[i][j]==0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');//为0时值不显示，宽高设为0
                theNumberCell.css('top',getPosTop(i,j)+50);
                theNumberCell.css('left',getPosLeft(i,j)+50);//将位置设置在gridcell中间，gridcell为100x100，getPostLeft计算出每个gridcell左上角与边框的距离，+50就是数值的距离
            }
            else{
                theNumberCell.css('width','100px');
                theNumberCell.css('height','100px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));//覆盖gridcell
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);//显示一个值
            }
        }
        hasConflicted[i][j]=false; 
    }
}
function generateOneNumber(){//生成数字
    if(nospace(board)){//检测是否还有空位能够生成数字
        return false;
    }
    else{
        //随机一个位置
        var randx=parseInt(Math.floor(Math.random() *4));//Math.floor后仍是浮点型，用parseInt强制转换成整型
        var randy=parseInt(Math.floor(Math.random() *4));//生成x和y坐标的随机数

        while(true){//设置一个死循环检测这个位置是否为空，若为空则可以作为新位置，跳出死循环，否则继续生成随机数
            if(board[randx][randy] != 0)
            {
            var randx =  parseInt(Math.floor(Math.random()*4));
            var randy =  parseInt(Math.floor(Math.random()*4));
            }
            else break;
        }
        //随机一个数字
        var randNumber=Math.random()<0.5?2:4;//等概率生成2或者4

        //在随机出的位置显示随机出的数字
        board[randx][randy]=randNumber;
        showNumberWithAnimation(randx,randy,randNumber);//通过动画效果在前端生成数字
    }


    return true;
}


$(document).keydown(function(event){//当按下按键时触发
    switch(event.keyCode){
        case 37://向左
            if(moveLeft()){//添加判断，若所有数字都在左则不能向左移动
                setTimeout("generateOneNumber()",210);//每次操作都会新生成一个数
                setTimeout("isgameover()",300);//判断游戏是否已经结束
            };
            break;
        case 38://向上
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            };
            break;
        case 39://向右
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            };
            break;
        case 40://向下
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            };
            break;
        default:
            break;
    }
});

function isgameover(){
    if(nospace(board)&&nomove(board)){
        gameover();
    }
}
function gameover(){
    alert('寄了');
}


function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }
    //moveLeft 
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
                for(k=0;k<j;k++){//遍历ij左侧所有空格
                    if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){//空位，直接移动
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){//相同值，无阻挡，当前位置未发生过碰撞，则相加后移动
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        //加分
                        score+=board[i][k];
                        updateScore(score);//将新的score通知前端
                        //修改碰撞状态为已撞过
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);//等待200毫秒再执行updata，否则动画效果耗时长，而计算机运算过快，会直接跳过动画效果
    return true;
}

function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }
    //moveRight 
    for(var i=0;i<4;i++){
        for(var j=2;j>=0;j--){
            if(board[i][j]!=0){
                for(k=3;k>j;k--){//遍历ij右侧所有空格
                    if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){//空位，直接移动
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k  ,board)&&!hasConflicted[i][k]){//相同值，相加后移动
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        //加分
                        score+=board[i][k];
                        updateScore(score);//将新的score通知前端
                        //已撞过
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);//等待200毫秒再执行updata，否则动画效果耗时长，而计算机运算过快，会直接跳过动画效果
    return true;
}

function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }
    //moveUp 
    for(var j=0;j<4;j++){
        for(var i=1;i<4;i++){
            if(board[i][j]!=0){
                for(var k=0;k<i;k++){//遍历ij上侧所有空格
                    if(board[k][j]==0&&noBlockVertical(j,k,i,board)){//空位，直接移动
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)&&!hasConflicted[k][j]){//相同值，相加后移动
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j]*=2;
                        board[i][j]=0;
                        //加分
                        score+=board[k][j];
                        updateScore(score);//将新的score通知前端
                        //已撞过
                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);//等待200毫秒再执行updata，否则动画效果耗时长，而计算机运算过快，会直接跳过动画效果
    return true;
}

function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }
    //moveDown 
    for(var j=0;j<4;j++){
        for(var i=2;i>=0;i--){
            if(board[i][j]!=0){
                for(k=3;k>i;k--){//遍历ij上侧所有空格
                    if(board[k][j]==0&&noBlockVertical(j,i,k,board)){//空位，直接移动
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[k][j]==board[i][j]&&noBlockVertical(j,i,k,board)&&!hasConflicted[k][j]){//相同值，相加后移动
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j]*=2;
                        board[i][j]=0;
                        //加分
                        score+=board[k][j];
                        updateScore(score);//将新的score通知前端
                        //已撞过
                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);//等待200毫秒再执行updata，否则动画效果耗时长，而计算机运算过快，会直接跳过动画效果
    return true;
}
