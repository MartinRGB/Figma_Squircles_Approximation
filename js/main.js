const canvas = document.querySelector('#playground')
const ctx    = canvas.getContext('2d')
ctx.imageSmoothingEnabled = true;
// canvas.width  = window.innerWidth
// canvas.height = window.innerHeight


//const pixelRatio = canvas.width/canvas.offsetWidth;

const halfWidth  = canvas.width / 2
const halfHeight = canvas.height / 2


// ################################## Upload Image ##################################

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
var imgOnLoad = false;
var drawing = new Image();
var scaleRatio = 1/3;


window.addEventListener("load", drawDefault, true);

function drawDefault(){                     
    imgOnLoad = false;
    drawing.src = "images/default_icns.png"; // can also be a remote URL e.g. http://           
    drawing.onload = function(){
      imgOnLoad = true;
    };            

}                 

function handleImage(e){
  var reader = new FileReader();
  imgOnLoad = false;
  reader.onload = function(event){
      drawing = new Image();
      drawing.onload = function(){
          imgOnLoad = true;
          rendering()
      }
      drawing.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);     
}


// ################################## Dat GUI ##################################

var isControl = false;

var params = {
  loadFile : function() { 
    document.getElementById('imageLoader').click();
  }
};

const options = {
  n: 4,
  r: 60,
  percentage:53,
  smoothness:50,
  width: 300,
  height: 300,
  round_position_x:0,
  round_position_y:0,
  img_position_x:0,
  img_position_y:0,
  tl:true,
  tr:true,
  bl:true,
  br:true,
  open_sketch_smooth:true,
  is_fill:false,
  is_img:false,
  is_show_arc:false,
  is_show_point:true
}

var radiusThereShold = 100;

var gui0,gui1,gui2,gui3,gui4,gui5,gui6,gui7,gui8,gui9,gui10,gui11,gui12,gui13,gui14,gui15,gui16,gui17,gui18,gui19,gui20;


const gui = new dat.GUI( { autoPlace: true, width: 300 } );
gui.close();

gui0 = gui.add(options, 'open_sketch_smooth').name("Figma Squircles");
gui1 = gui.add(options, 'percentage', 0, 100).step(.01).name("Percentage");
gui2 = gui.add(options, 'smoothness', 0, 100).step(1).name("Smoothness");
gui3 = gui.add(options, 'is_show_arc', 0, 100).name("Show Arc");
gui4 = gui.add(options, 'is_show_point', 0, 100).name("Show Point");

gui8 = gui.add(options, 'tl').name("Top-Left");
gui9 = gui.add(options, 'tr').name("Top-Reft");
gui10 =gui.add(options, 'bl').name("Bottom-Left");
gui11 = gui.add(options, 'br').name("Bottom-Right");

gui12 = gui.add(options, 'is_fill').name("Fill");

gui13 =gui.add(options, 'width', 0, 1080).step(.1).name("Width(px)")
gui14 = gui.add(options, 'height', 0, 1080).step(.1).name("Height(px)")
gui15 = gui.add(options, 'round_position_x', -1200, 1200).step(.1).name("PosX(px)")
gui16 = gui.add(options, 'round_position_y', -1200, 1200).step(.1).name("PosY(px)")
gui17 = gui.add(options, 'img_position_x', -1200, 1200).step(.1).name("ImagePosX(px)")
gui18 = gui.add(options, 'img_position_y', -1200, 1200).step(.1).name("ImagePosY(px)")

gui19 = gui.add(options, 'is_img').name("Show Image");
gui20 = gui.add(params, 'loadFile').name('Upload Image');

var guiN = [gui0,gui1,gui2,gui3,gui4,gui8,gui9,gui10,gui11,gui12,gui13,gui14,gui15,gui16,gui17,gui18,gui19,gui20]

for (let i = 0; i < guiN.length; i++) {
    
  guiN[i].onChange(function(value){
    // loop()
    isControl = true;
    rendering();
  });

  guiN[i].onFinishChange(function(value) {
    // Fires when a controller loses focus.
    isControl = false;
  });
}



// ################################## Rendering ##################################

const rendering = () => {
  if(!imgOnLoad){
    window.requestAnimationFrame(rendering)
  }
  else{

  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  if(options.is_img){
    ctx.drawImage(drawing,halfWidth - drawing.width/2/scaleRatio + options.img_position_x/scaleRatio,halfHeight - drawing.height/2/scaleRatio + options.img_position_y/scaleRatio,drawing.width/scaleRatio,drawing.height/scaleRatio);
  }

  if(options.open_sketch_smooth){


    if(options.percentage == 100 || options.smoothness == 0){
      drawRoundCorners(ctx, 
        {width:options.width/scaleRatio, height: options.height/scaleRatio}, 
        options.percentage/100*Math.min(options.width/2,options.height/2)/scaleRatio,
        halfWidth+options.round_position_x/scaleRatio, 
        halfHeight+options.round_position_y/scaleRatio,
        options.tl,options.tr,options.bl,options.br,
        options.is_fill)
    }
    else{
      drawFigmaSmoothCorners(ctx, 
        {width:options.width/scaleRatio, height: options.height/scaleRatio}, 
        options.percentage/100*Math.min(options.width/2,options.height/2)/scaleRatio, // real radius
        options.smoothness, // smoothness
        halfWidth+options.round_position_x/scaleRatio, // posX
        halfHeight+options.round_position_y/scaleRatio, // posY
        options.tl,options.tr,options.bl,options.br,
        options.is_fill)
    }

    if(options.is_show_arc){
      drawFigmaSmoothCornersArc(ctx, 
        {width:options.width/scaleRatio, height: options.height/scaleRatio}, 
        options.percentage/100*Math.min(options.width/2,options.height/2)/scaleRatio, // real radius
        options.smoothness, // smoothness
        halfWidth+options.round_position_x/scaleRatio, // posX
        halfHeight+options.round_position_y/scaleRatio, // posY
        options.tl,options.tr,options.bl,options.br)
    }

    if(options.is_show_point){
      drawFigmaSmoothCornersPoint(ctx, 
        {width:options.width/scaleRatio, height: options.height/scaleRatio}, 
        options.percentage/100*Math.min(options.width/2,options.height/2)/scaleRatio, // real radius
        options.smoothness, // smoothness
        halfWidth+options.round_position_x/scaleRatio, // posX
        halfHeight+options.round_position_y/scaleRatio, // posY
        options.tl,options.tr,options.bl,options.br)
    }

    var realRadius = options.percentage/100*Math.min(options.width/2,options.height/2)/scaleRatio;
    ctx.font = "48px PingFang serif";
    
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.beginPath();
    ctx.fillText("Round Radius - " + Math.round(realRadius/3).toString() , 200, 200);
    ctx.fillText("Corner Smoothing - " + options.smoothness.toString() , 200, 300);
    ctx.closePath();
    ctx.fill();
  }


}

rendering()