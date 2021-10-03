//动画效果
function showNumberWithAnimation(i,j,randNumber){
    var numberCell=$('#number-cell-'+i+"-"+j);

    numberCell.css('background-color',getNumberBackgroundColor(randNumber));
    numberCell.css('color',getNumberColor(randNumber));
    numberCell.text(randNumber);



    //动画部分
    numberCell.animate({//jquerry自带方法
        width:"100px",
        height:"100px",
        top:getPosTop(i,j),
        left:getPosLeft(i,j)
    },50);//50为50毫秒内完成动画效果 
}

function showMoveAnimation(fromx,fromy,tox,toy){
    var numberCell=$('#number-cell-'+fromx+'-'+fromy);//给numbercell赋值为fromx和fromy
    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)//将值变为tox,toy
    },200);
}


function updateScore(score){
    $('#score').text(score);
}