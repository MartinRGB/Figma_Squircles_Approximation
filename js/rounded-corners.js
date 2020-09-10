// ################################## Round Corner Functions ##################################

const drawRoundCorners = (ctx, size, r, posX, posY,tl,tr,bl,br,isFill) => {
  posX -= size.width / 2
  posY -= size.height / 2
  // r = Math.min(r,Math.min(size.width,size.height)/2)
    
  ctx.beginPath();
  ctx.moveTo(posX + r, posY);
  if(!tr){
    ctx.lineTo(posX + size.width, posY);
  }
  else{
    ctx.lineTo(posX + size.width - r, posY);
    ctx.bezierCurveTo(posX + size.width - r + getRoundRadius(r) , posY,posX + size.width,posY + r - getRoundRadius(r), posX + size.width, posY + r);
  }



  if(!br){
    ctx.lineTo(posX + size.width, posY + size.height);
  }
  else{
    ctx.lineTo(posX + size.width, posY + size.height - r);
    ctx.bezierCurveTo(posX+ size.width, posY + size.height - r + getRoundRadius(r), posX + size.width - r + getRoundRadius(r),posY + size.height,posX+ size.width - r, posY + size.height);
  }

  if(!bl){
    ctx.lineTo(posX, posY + size.height);
  }
  else{
    ctx.lineTo(posX + r, posY + size.height);
    ctx.bezierCurveTo(posX + r - getRoundRadius(r), posY + size.height,posX, posY + size.height - r + getRoundRadius(r), posX, posY + size.height - r);
  }

  if(!tl){
    ctx.lineTo(posX, posY);
  }
  else{
    ctx.lineTo(posX, posY + r);
    ctx.bezierCurveTo(posX, posY + r - getRoundRadius(r),posX + r - getRoundRadius(r),posY, posX+ r, posY);
  }
  
  ctx.closePath();   



  if(!isFill){
    ctx.strokeStyle = 'rgba(10, 10, 10, 0.7)'
    ctx.lineWidth=4;
    ctx.stroke()
  }
  else{
    ctx.strokeStyle = 'rgba(10, 10, 10, 0.7)'
    ctx.fillStyle = 'rgba(10, 10, 10, 0.7)'
    ctx.fill()
  } 
}


// ################################## Sketch Smooth Corner Functions ##################################

const drawFigmaSmoothCorners = (ctx, size, r,s,posX, posY,tl,tr,bl,br,isFill) => {
  posX -= size.width / 2
  posY -= size.height / 2

  var smoothness = s/100;
  var radius = r;
  var shortest_l = Math.min(size.width,size.height);

  const ANGLE_TO_RADIANS = Math.PI/180;

  var p,l,a,b,c,d;
  var angle_alpha,angle_beta,angle_theta;
  var d_div_c,h_longest;

  //p = (1 + smoothness) * radius;
  p = Math.min(shortest_l/2,(1 + smoothness) * radius);
  
  if(radius > shortest_l/4){
    // var change_percentage = radius/(shortest_l/2);
    // angle_beta = 90 * (1 - smoothness*(1 - change_percentage));
    // angle_alpha = 45 * smoothness*(1 - change_percentage);
    var change_percentage = (radius - shortest_l/4)/(shortest_l/4);
    angle_beta = 90 * (1 - smoothness*(1 - change_percentage));
    angle_alpha = 45 * smoothness *(1 - change_percentage);
  }
  else{
    angle_beta = 90 * (1 - smoothness);
    angle_alpha = 45 * smoothness;
  }


  angle_theta = (90 - angle_beta)/2;

  d_div_c = Math.tan(angle_alpha * ANGLE_TO_RADIANS);
  h_longest = radius * Math.tan(angle_theta/2 * ANGLE_TO_RADIANS);

  l = Math.sin(angle_beta/2 * ANGLE_TO_RADIANS) * radius * Math.pow(2,1/2);
  c = h_longest * Math.cos(angle_alpha * ANGLE_TO_RADIANS);
  d = c * d_div_c;
  b = ( (p - l) - (1 + d_div_c) * c ) / 3;
  a = 2*b;

  logV('angle_alpha',angle_alpha);
  logV('angle_beta',angle_beta);
  logV('angle_theta',angle_theta);

  logV('d_div_c',d_div_c);
  logV('h_longest',h_longest);

  logV('p',p);
  logV('l',l);
  logV('a',a);
  logV('b',b);
  logV('c',c);
  logV('d',d);


  //void ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);

  ctx.beginPath();

  //移动到上方中点
  ctx.moveTo(posX + size.width/2 , posY);

  //右上
  if(!tr){
    ctx.lineTo(posX + size.width, posY);
  }
  else{
    ctx.lineTo(
      posX + Math.max(size.width/2,size.width - p),
      posY);
    ctx.bezierCurveTo(
      posX + size.width - (p - a), 
      posY,
      posX + size.width - (p - a - b),
      posY,
      posX + size.width - (p - a - b - c),
      posY + d
      );
    ctx.arc(
      posX+size.width-radius,
      posY + radius,
      radius,
      (270. + angle_theta)/180 * Math.PI,
      (360. -  angle_theta )/180 * Math.PI,
      false);
    ctx.bezierCurveTo(
      posX + size.width,
      posY + (p - a - b),
      posX + size.width,
      posY + (p - a),
      posX + size.width,
      posY + Math.min(size.height/2,p));
  }

  //右下
  if(!br){
    ctx.lineTo(posX + size.width, posY + size.height);
  }
  else{
    ctx.lineTo(
        posX + size.width,
        posY + Math.max(size.height/2,size.height - p));
    ctx.bezierCurveTo(
        posX + size.width,
        posY + size.height - (p - a),
        posX + size.width,
        posY + size.height - (p - a - b),
        posX + size.width - d,
        posY + size.height - (p - a - b - c));
    ctx.arc(
        posX + size.width - radius,
        posY + size.height - radius,
        radius,
        (0. + angle_theta)/180 * Math.PI,
        (90. -  angle_theta )/180 * Math.PI,
        false);
    ctx.bezierCurveTo(
        posX + size.width - (p - a - b),
        posY + size.height,
        posX + size.width - (p - a),
        posY + size.height,
        posX + Math.max(size.width/2,size.width - p),
        posY + size.height);
  }

  //下左
  if(!bl){
    ctx.lineTo(posX, posY + size.height);
  }
  else{
    ctx.lineTo(
      posX + Math.min(size.width/2,p),
      posY + size.height);
    ctx.bezierCurveTo(
        posX + (p - a),
        posY + size.height,
        posX + (p - a - b),
        posY + size.height,
        posX + (p - a - b - c),
        posY + size.height -  d);
    ctx.arc(
        posX + radius,
        posY + size.height -  radius,
        radius,
        (90. + angle_theta)/180 * Math.PI,
        (180. -  angle_theta )/180 * Math.PI,
        false);
    ctx.bezierCurveTo(
        posX,
        posY + size.height - (p - a - b),
        posX ,
        posY + size.height - (p - a),
        posX ,
        posY + Math.max(size.height/2,size.height - p));
  }

  //左上
  if(!tl){
    ctx.lineTo(posX, posY);
  }
  else{
    ctx.lineTo(
        posX,
        posY + Math.min(size.height/2,p));
    ctx.bezierCurveTo(
        posX,
        posY + (p - a),
        posX,
        posY + (p - a - b),
        posX + d,
        posY + (p - a - b -c));
    ctx.arc(
        posX + radius,
        posY + radius,
        radius,
        (180. + angle_theta)/180 * Math.PI,
        (270. -  angle_theta )/180 * Math.PI,
        false);
    ctx.bezierCurveTo(
        posX + (p - a - b),
        posY,
        posX + (p - a),
        posY,
        posX + Math.min(size.width/2,p),
        posY);  
  
  }
  
  ctx.closePath();      

  if(!isFill){
    ctx.strokeStyle = 'rgba(10, 10, 10, 0.2)'
    ctx.lineWidth=4;
    ctx.stroke()
  }
  else{
    ctx.strokeStyle = 'rgba(10, 10, 10, 0.2)'
    ctx.fillStyle = 'rgba(10, 10, 10, 0.2)'
    ctx.fill()
  } 
}

const drawFigmaSmoothCornersArc = (ctx, size, r,s,posX, posY,tl,tr,bl,br) => {
  posX -= size.width / 2
  posY -= size.height / 2

  var smoothness = s/100;
  var radius = r;
  var shortest_l = Math.min(size.width,size.height);

  const ANGLE_TO_RADIANS = Math.PI/180;

  var p,l,a,b,c,d;
  var angle_alpha,angle_beta,angle_theta;
  var d_div_c,h_longest;
  
  //p = (1 + smoothness) * radius;
  p = Math.min(shortest_l/2,(1 + smoothness) * radius);
  
  if(radius > shortest_l/4){
    var change_percentage = (radius - shortest_l/4)/(shortest_l/4);
    angle_beta = 90 * (1 - smoothness*(1 - change_percentage));
    angle_alpha = 45 * smoothness *(1 - change_percentage);
  }
  else{
    angle_beta = 90 * (1 - smoothness);
    angle_alpha = 45 * smoothness;
  }

  angle_theta = (90 - angle_beta)/2;

  d_div_c = Math.tan(angle_alpha * ANGLE_TO_RADIANS);
  h_longest = radius * Math.tan(angle_theta/2 * ANGLE_TO_RADIANS);

  l = Math.sin(angle_beta/2 * ANGLE_TO_RADIANS) * radius * Math.pow(2,1/2);
  c = h_longest * Math.cos(angle_alpha * ANGLE_TO_RADIANS);
  d = c * d_div_c;
  b = ( (p - l) - (1 + d_div_c) * c ) / 3;
  a = 2*b;

  //void ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);

  //右上
  if(!tr){
  }
  else{
    ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
    ctx.beginPath();
    ctx.moveTo(
      posX+size.width-radius,
      posY + radius);
    ctx.arc(
      posX+size.width-radius,
      posY + radius,
      radius,
      (0. )/180 * Math.PI,
      (360.)/180 * Math.PI,
      false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.moveTo(
      posX+size.width-radius,
      posY + radius);
    ctx.arc(
      posX+size.width-radius,
      posY + radius,
      radius,
      (270. + angle_theta)/180 * Math.PI,
      (360. -  angle_theta )/180 * Math.PI,
      false);
    ctx.closePath();
    ctx.fill();

    drawCenter(
      ctx,
      posX+size.width-radius,
      posY + radius,
      6,
      "rgba(255,0,0,1)"
    )



  }

  //右下
  if(!br){
  }
  else{

    ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
    ctx.beginPath();
    ctx.moveTo(
      posX + size.width - radius,
      posY + size.height - radius,
      );
    ctx.arc(
      posX + size.width - radius,
      posY + size.height - radius,
      radius,
      (0.)/180 * Math.PI,
      (360.)/180 * Math.PI,
      false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.moveTo(
      posX + size.width - radius,
      posY + size.height - radius,
      );
    ctx.arc(
      posX + size.width - radius,
      posY + size.height - radius,
      radius,
      (0. + angle_theta)/180 * Math.PI,
      (90. -  angle_theta )/180 * Math.PI,
      false);
    ctx.closePath();
    ctx.fill();

    drawCenter(
      ctx,
      posX + size.width - radius,
      posY + size.height - radius,
      6,
      "rgba(255,0,0,1)"
    );


  }

  //下左
  if(!bl){
  }
  else{

    ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
    ctx.beginPath();
    ctx.moveTo(
      posX + radius,
      posY + size.height -  radius,
      );
    ctx.arc(
      posX + radius,
      posY + size.height -  radius,
      radius,
      (0.)/180 * Math.PI,
      (360.)/180 * Math.PI,
      false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,0, 0, 0.4)";
    ctx.beginPath();
    ctx.moveTo(
      posX + radius,
      posY + size.height -  radius,
      );
    ctx.arc(
      posX + radius,
      posY + size.height -  radius,
      radius,
      (90. + angle_theta)/180 * Math.PI,
      (180. -  angle_theta )/180 * Math.PI,
      false);
    ctx.closePath();
    ctx.fill();

    drawCenter(
      ctx,
      posX + radius,
      posY + size.height -  radius,
      6,
      "rgba(255,0,0,1)"
    )


  }

  //左上
  if(!tl){
  }
  else{

    ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
    ctx.beginPath();
    ctx.moveTo(
      posX + radius,
      posY + radius,
      );
    ctx.arc(
      posX + radius,
      posY + radius,
      radius,
      (0.)/180 * Math.PI,
      (360.)/180 * Math.PI,
      false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.moveTo(
      posX + radius,
      posY + radius,
      );
    ctx.arc(
      posX + radius,
      posY + radius,
      radius,
      (180. + angle_theta)/180 * Math.PI,
      (270. -  angle_theta )/180 * Math.PI,
      false);
    ctx.closePath();
    ctx.fill();

    drawCenter(
      ctx,
      posX + radius,
      posY + radius,
      6,
      "rgba(255,0,0,1)"
    )

  }
  
}

const drawFigmaSmoothCornersPoint = (ctx, size, r,s,posX, posY,tl,tr,bl,br) => {
  posX -= size.width / 2
  posY -= size.height / 2

  var smoothness = s/100;
  var radius = r;
  var shortest_l = Math.min(size.width,size.height);

  const ANGLE_TO_RADIANS = Math.PI/180;

  var p,l,a,b,c,d;
  var angle_alpha,angle_beta,angle_theta;
  var d_div_c,h_longest;
  
  //p = (1 + smoothness) * radius;
  p = Math.min(shortest_l/2,(1 + smoothness) * radius);
  
  if(radius > shortest_l/4){
    var change_percentage = (radius - shortest_l/4)/(shortest_l/4);
    angle_beta = 90 * (1 - smoothness*(1 - change_percentage));
    angle_alpha = 45 * smoothness *(1 - change_percentage);
  }
  else{
    angle_beta = 90 * (1 - smoothness);
    angle_alpha = 45 * smoothness;
  }


  angle_theta = (90 - angle_beta)/2;

  d_div_c = Math.tan(angle_alpha * ANGLE_TO_RADIANS);
  h_longest = radius * Math.tan(angle_theta/2 * ANGLE_TO_RADIANS);

  l = Math.sin(angle_beta/2 * ANGLE_TO_RADIANS) * radius * Math.pow(2,1/2);
  c = h_longest * Math.cos(angle_alpha * ANGLE_TO_RADIANS);
  d = c * d_div_c;
  b = ( (p - l) - (1 + d_div_c) * c ) / 3;
  a = 2*b;

  //void ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);

  //右上
  if(!tr){
  }
  else{


    drawPoint(
      ctx,
      posX + Math.max(size.width/2,size.width - p),
      posY,
      10,
      "rgba(0,0,0,0.4)"
    )

    drawPoint(
      ctx,
      posX + size.width - (p - a - b - c),
      posY + d,
      10,
      "rgba(0,0,0,0.4)"
    )

    drawPoint(
      ctx,
      posX + size.width - d,
      posY + d + l,
      10,
      "rgba(0,0,0,0.4)"
    )

    drawPoint(
      ctx,
      posX + size.width,
      posY + Math.min(size.height/2,p),
      10,
      "rgba(0,0,0,0.4)"
    )

  }

  //右下
  if(!br){
  }
  else{


    
    drawPoint(
      ctx,
      posX + size.width,
      posY + Math.max(size.height/2,size.height - p),
      10,
      "rgba(0,0,0,0.4)"
    );

    drawPoint(
      ctx,
      posX + size.width - d,
      posY + size.height - (p - a - b - c),
      10,
      "rgba(0,0,0,0.4)"
    )

    drawPoint(
      ctx,
      posX + size.width - d - l,
      posY + size.height - d,
      10,
      "rgba(0,0,0,0.4)"
    )

    drawPoint(
      ctx,
      posX + Math.max(size.width/2,size.width - p),
      posY + size.height,
      10,
      "rgba(0,0,0,0.4)"
    )

  }

  //下左
  if(!bl){
  }
  else{


    drawPoint(
      ctx,
      posX + Math.min(size.width/2,p),
      posY + size.height,
      10,
      "rgba(0,0,0,0.4)"
    )

    drawPoint(
      ctx,
      posX + (p - a - b - c),
      posY + size.height -  d,
      10,
      "rgba(0,0,0,0.4)"
    )

    drawPoint(
      ctx,
      posX + d,
      posY + size.height - d - l,
      10,
      "rgba(0,0,0,0.4)"
    )

    drawPoint(
      ctx,
      posX ,
      posY + Math.max(size.height/2,size.height - p),
      10,
      "rgba(0,0,0,0.4)"
    )

  }

  //左上
  if(!tl){
  }
  else{


    drawPoint(
      ctx,
      posX,
      posY + Math.min(size.height/2,p),
      10,
      "rgba(0,0,0,0.4)"
    )

    drawPoint(
      ctx,
      posX + d,
      posY + (p - a - b -c),
      10,
      "rgba(0,0,0,0.4)"
    )

    drawPoint(
      ctx,
      posX + d + l,
      posY + d,
      10,
      "rgba(0,0,0,0.4)"
    )

    drawPoint(
      ctx,
      posX + Math.min(size.width/2,p),
      posY,
      10,
      "rgba(0,0,0,0.4)"
    )

  }
  
}

drawPoint = (ctx,posX,posY,radius,color) =>{
  ctx.beginPath();
  ctx.arc(
    posX,
    posY,
    radius,
    0 * Math.PI,
    2 * Math.PI,
    false);
  ctx.closePath();

  ctx.strokeStyle =  color;
  ctx.lineWidth = 3;
  ctx.stroke();
}

drawCenter = (ctx,posX,posY,radius,color) =>{
  ctx.beginPath();
  ctx.arc(
    posX,
    posY,
    radius,
    0 * Math.PI,
    2 * Math.PI,
    false);
  ctx.closePath();
  ctx.fillStyle =  color;
  ctx.lineWidth = 3;
  ctx.fill();
}

const getRoundRadius = (radius) =>{
  return radius/2+radius/60*Math.PI;
}

logV = (string,variable) =>{
  console.log(" " + string + " is " + variable)
}



const drawFigmaSmoothCornersBackup = (ctx, size, r,s,posX, posY,tl,tr,bl,br,isFill) => {
  posX -= size.width / 2
  posY -= size.height / 2

  var smoothness = s/100;
  var radius = r;
  var shortest_l = Math.min(size.width,size.height);

  const ANGLE_TO_RADIANS = Math.PI/180;

  var p,l,a,b,c,d;
  var angle_alpha,angle_beta,angle_theta;
  var d_div_c,h_longest;

  //p = (1 + smoothness) * radius;
  p = (1 + smoothness) * radius;
  
  angle_alpha = 45 * smoothness;
  angle_beta = 90 * (1 - smoothness);
  angle_theta = (90 - angle_beta)/2;

  d_div_c = Math.tan(angle_alpha * ANGLE_TO_RADIANS);
  h_longest = radius * Math.tan(angle_theta/2 * ANGLE_TO_RADIANS);

  l = Math.sin(angle_beta/2 * ANGLE_TO_RADIANS) * radius * Math.pow(2,1/2);
  c = h_longest * Math.cos(angle_alpha * ANGLE_TO_RADIANS);
  d = c * d_div_c;
  b = ( (p - l) - (1 + d_div_c) * c ) / 3;
  a = 2*b;

  logV('angle_alpha',angle_alpha);
  logV('angle_beta',angle_beta);
  logV('angle_theta',angle_theta);

  logV('d_div_c',d_div_c);
  logV('h_longest',h_longest);

  logV('p',p);
  logV('l',l);
  logV('a',a);
  logV('b',b);
  logV('c',c);
  logV('d',d);


  //void ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);

  ctx.beginPath();

  //移动到上方中点
  ctx.moveTo(posX + size.width/2 , posY);

  //右上
  if(!tr){
    ctx.lineTo(posX + size.width, posY);
  }
  else{
    ctx.lineTo(
      posX + Math.max(size.width/2,size.width - p),
      posY);
    ctx.bezierCurveTo(
      posX + size.width - (p - a), 
      posY,
      posX + size.width - (p - a - b),
      posY,
      posX + size.width - (p - a - b - c),
      posY + d);
    ctx.arc(
      posX+size.width-radius,
      posY + radius,
      radius,
      (270. + angle_theta)/180 * Math.PI,
      (360. -  angle_theta )/180 * Math.PI,
      false);
    ctx.bezierCurveTo(
      posX + size.width,
      posY + (p - a - b),
      posX + size.width,
      posY + (p - a),
      posX + size.width,
      posY + Math.min(size.height/2,p));
  }

  //右下
  if(!br){
    ctx.lineTo(posX + size.width, posY + size.height);
  }
  else{
    ctx.lineTo(
        posX + size.width,
        posY + Math.max(size.height/2,size.height - p));
    ctx.bezierCurveTo(
        posX + size.width,
        posY + size.height - (p - a),
        posX + size.width,
        posY + size.height - (p - a - b),
        posX + size.width - d,
        posY + size.height - (p - a - b - c));
    ctx.arc(
        posX + size.width - radius,
        posY + size.height - radius,
        radius,
        (0. + angle_theta)/180 * Math.PI,
        (90. -  angle_theta )/180 * Math.PI,
        false);
    ctx.bezierCurveTo(
        posX + size.width - (p - a - b),
        posY + size.height,
        posX + size.width - (p - a),
        posY + size.height,
        posX + Math.max(size.width/2,size.width - p),
        posY + size.height);
  }

  //下左
  if(!bl){
    ctx.lineTo(posX, posY + size.height);
  }
  else{
    ctx.lineTo(
      posX + Math.min(size.width/2,p),
      posY + size.height);
    ctx.bezierCurveTo(
        posX + (p - a),
        posY + size.height,
        posX + (p - a - b),
        posY + size.height,
        posX + (p - a - b - c),
        posY + size.height -  d);
    ctx.arc(
        posX + radius,
        posY + size.height -  radius,
        radius,
        (90. + angle_theta)/180 * Math.PI,
        (180. -  angle_theta )/180 * Math.PI,
        false);
    ctx.bezierCurveTo(
        posX,
        posY + size.height - (p - a - b),
        posX ,
        posY + size.height - (p - a),
        posX ,
        posY + Math.max(size.height/2,size.height - p));
  }

  //左上
  if(!tl){
    ctx.lineTo(posX, posY);
  }
  else{
    ctx.lineTo(
        posX,
        posY + Math.min(size.height/2,p));
    ctx.bezierCurveTo(
        posX,
        posY + (p - a),
        posX,
        posY + (p - a - b),
        posX + d,
        posY + (p - a - b -c));
    ctx.arc(
        posX + radius,
        posY + radius,
        radius,
        (180. + angle_theta)/180 * Math.PI,
        (270. -  angle_theta )/180 * Math.PI,
        false);
    ctx.bezierCurveTo(
        posX + (p - a - b),
        posY,
        posX + (p - a),
        posY,
        posX + Math.min(size.width/2,p),
        posY);  
  
  }
  
  ctx.closePath();      

  if(!isFill){
    ctx.strokeStyle = 'rgba(10, 10, 10, 0.2)'
    ctx.lineWidth=4;
    ctx.stroke()
  }
  else{
    ctx.strokeStyle = 'rgba(10, 10, 10, 0.2)'
    ctx.fillStyle = 'rgba(10, 10, 10, 0.2)'
    ctx.fill()
  } 
}