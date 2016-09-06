/**
 * @author MiguelMorales / https://github.com/MikeMoralesDEV
 */



var basicTHREE = { REVISION: '74' };


if ( typeof define === 'function' && define.amd ) {

	define( 'basicthree', basicTHREE );

} else if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {

	module.exports = basicTHREE;

}


//BASIC GLOBAL VARIABLES - MODULE 1
basicTHREE.camera;
basicTHREE.scene;
basicTHREE.renderer;
basicTHREE.cubeCamera;
colorRed = new THREE.Color(0xFF0000);
colorWhite = new THREE.Color(0xffffff);
colorBlue = new THREE.Color(0x0000ff);
colorYellow = new THREE.Color(0xffff00);
colorBlack = new THREE.Color(0x000000);
colorGreen = new THREE.Color(0x008000);
colorOrange = new THREE.Color(0xffa500);
basicTHREE.pointLight;
basicTHREE.meshLoaded;
basicTHREE.count;


//MOVEMENT GLOBAL VARIABLES - MODULE 2
clock = new THREE.Clock();
delta = clock.getDelta();
moveDistance = 200 * delta; // 200 pixels per second
rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
basicTHREE.Avatar;
const KEYUP             = 38;        // up key
const KEYDOWN             = 40;        // down key
const KEYLEFT             = 37;        // left key
const KEYRIGHT            = 39;        // right key
const KEYA 				= 65;        // a key
const KEYW             = 87;           //w key
const KEYS				= 83;		//s key
const KEYD 				= 68;		//d key
const KEYQ 				= 81;        //q key
const KEYE             = 69;           //e key
const KEYF				= 70;		//f key
const KEYZ 				= 90;		//z key
const KEYX 				= 88;		//z key
basicTHREE.resetPos;
basicTHREE.resetRot;
var firstDelta;

//COLLISION GLOBAL VARIABLES - MODULE 3
basicTHREE.arrayCollidables=[];
var stop = 1;
basicTHREE.testCount = 0;
var onlyCollidables = 0;

//ELEARNING GLOBAL VARIABLES - MODULE 4
basicTHREE.arrayFunctions= new Array();
var idCount = 0;
basicTHREE.explanation= [];
basicTHREE.notes = ["fail.jpg", "good-job.png", "nicejob.gif", "perfect10.GIF"];
var quiz=[];
var initCount = 0;
var question=[];
var questionScore = 0;
var currentQ = 0;
var questionLong=[];
var maxScoreC = 0;
var audio;
var standbyID;


basicTHREE.InitiateScene = function(cameraType, rendererType){
	firstDelta=delta;
	for(var i=0; i<10; i++) {
	    basicTHREE.explanation[i] = [];
	    for(var j=0; j<3; j++) {
	        basicTHREE.explanation[i][j] = undefined;
	    }
	}

	//Control de errores generales
	if(arguments.length > 2){

		console.error("Hay demasiados argumentos. \n Los argumentos opcionales son camera y renderer.");
		return 0;
	}

	//Control de camara
	if(cameraType != "CubeCamera" && cameraType != "OrthographicCamera" && cameraType != "PerspectiveCamera"){

		console.error("No se ha escogido ningun tipo de camara valido. Las camaras soportadas por el modo básico de THREEjs son :\nCubeCamera\nOrthographicCamera\nPerspectiveCamera\n\nSe usara este ultimo tipo de camara para usarla como por defecto");
		cameraType = "PerspectiveCamera";

	}

	//Control de renderer
	if(rendererType != "WebGL" && rendererType != "Canvas"){
		console.error("No se introdujo ningun renderer o se introdujo uno incorrecto por lo que se escogera por defecto WebGL");
		rendererType = "WebGL";
	}
	
	//Creacion de escena
	var scene = new THREE.Scene();

	//Creacion de camara
	if(cameraType == "PerspectiveCamera"){
		var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
		camera.position.z = 5;
	    camera.lookAt(scene.position);
	}
	else if(cameraType == "OrthographicCamera"){
		var camera = new THREE.OrthographicCamera( window.innerWidth / - 16, window.innerWidth / 16,window.innerHeight / 16, window.innerHeight / - 16, -200, 500);
    	camera.position.x = 2;	
    	camera.position.y = 1;
	    camera.position.z = 3;
	    camera.lookAt(scene.position);

	}else if(cameraType == "CubeCamera"){

		var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
		camera.position.z = 5;
	    camera.lookAt(scene.position);

		basicTHREE.cubeCamera = new THREE.CubeCamera(1, 100000, 128 );

	}

	//Renderizacion
	if(rendererType == "WebGL"){
		console.log("Renderizando con WebGL");
		var renderer = new THREE.WebGLRenderer({alpha: true});
	}else{
		console.log("Renderizando con Canvas");
		var renderer = new THREE.CanvasRenderer();
	}
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0xffffff, 1.0); //No hace falta codigo adicional. Esto sirve como cielo.
   	if(rendererType=="WebGL")renderer.shadowMap.enabled;
	document.body.appendChild( renderer.domElement );


	//Por ultimo volvemos responsiva la aplicacion para cualquier tipo de resolucion
	window.addEventListener('resize', function() {
      var WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    });

	//Creacion de suelo y cielo
		// Suelo
	var texture = new THREE.TextureLoader().load( "js/desert.jpg" );
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 50, 50 );

	groundBasic = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture } );
	groundBasic.color.setHSL( 0.1, 0.9, 0.7 );

	ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 50000, 50000 ), groundBasic );
	ground.position.y = - 215;
	ground.rotation.x = - Math.PI / 2;
	scene.add( ground );

	ground.castShadow = false;
	ground.receiveShadow = true;


	basicTHREE.camera=camera;
	basicTHREE.scene=scene;
	basicTHREE.renderer=renderer;

};

//Material sombreado
basicTHREE.shadedMaterial = function(colorA){

	//Control de errores
		//Compruebo los parametros
	if(arguments.length > 1){
		console.error("Demasiados parametros");
	}
	if(arguments.length < 1){
		console.error("Se necesita el parametro color para crear el material sombreado. Sin el no hay efecto.");	
	}
		//Si no existe ilumiancion, la creo
	if(basicTHREE.pointLight == null){
		basicTHREE.iluminate();
	}

	var mat = new THREE.MeshLambertMaterial( {color: colorA} );
	return mat;

};

//Material con brillo
basicTHREE.shinyMaterial = function(colorA){

	//Control de errores
		//Compruebo los parametros
	if(arguments.length > 1){
		console.error("Demasiados parametros");
	}
	if(arguments.length < 1){
		console.error("Se necesita el parametro color para crear el material brillante. Sin el no hay efecto.");	
	}
		//Si no existe ilumiancion, la creo
	if(basicTHREE.pointLight == null){
		basicTHREE.iluminate();
	}

	var mat = new THREE.MeshPhongMaterial( {color: colorA} );
	return mat;
};

//Material coloreado
basicTHREE.colorfulMaterial = function(){

	//Control de errores
		//Compruebo los parametros
	if(arguments.length != 0){
		console.error("Demasiados parametros. Esta funcion no requiere parametros, colorea por si solo todas las caras de la figura aleatoriamente.");
	}

	var mat = new THREE.MeshNormalMaterial();
	return mat;
};

//Iluminacion
basicTHREE.iluminate = function(colorA){

	//Control de errores
		//Compruebo los parametros
	if(arguments.length > 1){
		console.error("Demasiados parametros");
	}
	if(arguments.length < 1){
		console.error("Se necesita el parametro color para crear la iluminacion. Se utilizara iluminacion blanca por defecto.");
		colorA = colorWhite;
	}
	basicTHREE.pointLight = new THREE.PointLight( colorA, 1, 0 );
	basicTHREE.pointLight.position.set( 50, 50, 50 );
	basicTHREE.scene.add( basicTHREE.pointLight );

};

//Loader

basicTHREE.loadMesh = function(urlLink, name, x=0, z=5, collidable=0, funcion=0){
	if(arguments.length < 2){
		if(basicTHREE.count == undefined && name == undefined){
			basicTHREE.count = 0;
			name = basicTHREE.count;
		}
		if(name == undefined){
			name = basicTHREE.count;
			basicTHREE.count++;
		}
		console.error("No funcionara con seguridad ya que faltan argumentos; ya sea el url o el nombre del objeto.\nPondremos como nombre por defecto un numero secuencial, en este caso : \"" + name + "\".");

	}

	var loader = new THREE.JSONLoader();
	loader.load(urlLink, function(geometry, materials){
		mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
		mesh.name = name;
		var box = new THREE.Box3().setFromObject(mesh);
		mesh.position.set(0, -215+box.max.y/3, 5);
		basicTHREE.scene.add(mesh);
		if(collidable==1){
			basicTHREE.arrayCollidables.push(mesh);
			basicTHREE.arrayFunctions.push(funcion);
		}
	});

	
};

//Adder
basicTHREE.addElement = function(geometry, material, x=0, z=5, collidable=0, funcion=0){
	var mesh = new THREE.Mesh( geometry, material );
	var box = new THREE.Box3().setFromObject(mesh);
	mesh.position.set(x, -215+box.max.y, z);
	basicTHREE.scene.add( mesh );
	if(collidable==1){
		basicTHREE.arrayCollidables.push(mesh);
		basicTHREE.arrayFunctions.push(funcion);
	}
	if(funcion==explanationPopup){
		popupInit();
	}
	else if(funcion==quizTest){
		quizInit();
	}
	else if(funcion==questionPopup || funcion==copiadoTest){
		questionInit();
	}
	else if(collidable==1){onlyCollidables++;}
	return mesh;

};


//Getter
basicTHREE.getElement = function(name){
	if(typeof name == "string"){
		return basicTHREE.scene.getObjectByName(name);
	}
	else{
		return basicTHREE.scene.getObjectById(name);
	}

};



/////////////////CAMERA/AVATAR CONTROL///////////////////////
//Orbit Camera Mouse&Keyboard
basicTHREE.createCameraControls = function(){

	var controls = new THREE.OrbitControls(basicTHREE.camera, basicTHREE.renderer.domElement);
	controls.enableKeys = false; 

	return controls;

};

var fired=0;

//Movimiento y colision
basicTHREE.avatarLive = function(MovingMesh, cond=1, glob=0, rotate=0, reset=1){
	if(basicTHREE.resetPos==undefined){
		basicTHREE.Avatar = MovingMesh; 
		basicTHREE.Avatar.add(basicTHREE.camera);
		basicTHREE.resetPos=[MovingMesh.position.x, MovingMesh.position.y, MovingMesh.position.z]; //estos no varian para el reset.
		basicTHREE.resetRot=[MovingMesh.rotation.x, MovingMesh.rotation.y, MovingMesh.rotation.z];
	}

	
 		document.addEventListener('keydown', function(e)
        {
			if(!fired && delta!=0){
				fired=1;
            var key = e.keyCode;
            basicTHREE.testCollidable(key, MovingMesh, cond, glob, rotate, reset);

           
            }
        });

            fired=0;


};

basicTHREE.testCollidable = function(key, MovingMesh, cond, glob, rotate, reset){
	//1000 ha resultado el numero perfecto del contador para que las funciones se ejecuten solo una vez con cada colision
	if(basicTHREE.testCount==1000){
		basicTHREE.testCount=0;
		stop = 1;
		delta = firstDelta;

	}
	var originPoint = basicTHREE.Avatar.position.clone(); //este valor varia, para la colisión
	for (var vertexIndex = 0; vertexIndex < basicTHREE.Avatar.geometry.vertices.length; vertexIndex++)
	{		
			var localVertex = basicTHREE.Avatar.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4( basicTHREE.Avatar.matrix );
			var directionVector = globalVertex.sub( basicTHREE.Avatar.position );

			var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObjects( basicTHREE.arrayCollidables );
			//0.8 es la distancia que considero "de seguridad", para evitar que se atasque el elemento en otro. 
			if ( collisionResults.length > 0 && collisionResults[0].distance-1 < directionVector.length() ){ 
				stop = 0;
				for( var i = 0; i < basicTHREE.arrayCollidables.length; i++){
					if(collisionResults[0].object==basicTHREE.arrayCollidables[i] && basicTHREE.arrayFunctions[i]!=0 ){
						basicTHREE.arrayFunctions[i](i);
						basicTHREE.testCount=1;
					}
				}
			}
	}

		 switch( key )
            {

            	//Movimiento condicionado
                case KEYUP:

                	if(cond==1 && stop){

                    	MovingMesh.translateZ( -moveDistance*10 );

                	}
                    else if(cond==1 && !stop){

                    	MovingMesh.translateZ( moveDistance*10 );
                    	stop = 1;

                    }
                    break;
                    
                case KEYDOWN:
                   	if(cond==1 && stop)
	                    MovingMesh.translateZ( moveDistance*10 );
	                else if(cond==1 && !stop){
                    	MovingMesh.translateZ( -moveDistance*10 );
						stop = 1;
	                }
                    break;
                    
                case KEYLEFT:

                   	if(cond==1 && stop) {
       					MovingMesh.rotateOnAxis( new THREE.Vector3(0,1,0), 0.05);
                    	MovingMesh.translateZ( -moveDistance*10 );
                    }else if(cond==1 && !stop){
                    	MovingMesh.translateX( moveDistance*10);
						stop = 1;
                    }
                    break;
                    
                case KEYRIGHT:

                    if(cond==1 && stop){
                        MovingMesh.rotateOnAxis( new THREE.Vector3(0,1,0), -0.05);
	                    MovingMesh.translateZ( -moveDistance*10 );
                    }
	                else if(cond==1 && !stop){
                    	MovingMesh.translateX( -moveDistance*10 );
						stop = 1;
	                }
                    break;
                    
                    //Movimiento global
                case KEYW:
                	if(glob==1 && stop)
                   		MovingMesh.translateZ( -moveDistance );
                   	else if(glob==1 && !stop){
                    	MovingMesh.translateZ( moveDistance );
               			stop = 1;
                   	}
                    break;
                    
                case KEYS:
                	if(glob==1 && stop)                  
                    	MovingMesh.translateZ( moveDistance );
                    else if(glob==1 && !stop)
                    	MovingMesh.translateZ( -moveDistance );
                    break;
                    
                case KEYA:
                	if(glob==1 && stop)              
                    	MovingMesh.translateX( -moveDistance );
                    else if(glob==1 && !stop)
                    	MovingMesh.translateX( moveDistance );
                    break;
                    
                case KEYD:
                	if(glob==1 && stop)                
                    	MovingMesh.translateX( moveDistance );
                    else if(glob==1 && !stop)
                    	MovingMesh.translateX( -moveDistance );
                    break;

					//Giros
                case KEYQ:
                	if(rotate==1 && stop)               
						MovingMesh.rotateOnAxis( new THREE.Vector3(0,1,0), 0.05);
		            break;
                    
                case KEYE:
                	if(rotate==1 && stop)
						MovingMesh.rotateOnAxis( new THREE.Vector3(0,1,0), -0.05);                    
					break;

				case KEYF:
					if(rotate==1 && stop)
						MovingMesh.rotateOnAxis( new THREE.Vector3(1,0,0), 0.05);
					break;

				case KEYZ:
					if(rotate==1 && stop)
						MovingMesh.rotateOnAxis( new THREE.Vector3(1,0,0), -0.05);
					break;

					//Reinicio
 				case KEYX:
 					if(reset==1){
	 					MovingMesh.position.x = basicTHREE.resetPos[0];
 						MovingMesh.position.y = basicTHREE.resetPos[1];
 						MovingMesh.position.z = basicTHREE.resetPos[2];
 						MovingMesh.rotation.x = basicTHREE.resetRot[0];
 						MovingMesh.rotation.y = basicTHREE.resetRot[1];
 						MovingMesh.rotation.z = basicTHREE.resetRot[2];
 					}
					break;                   
            }
	
	basicTHREE.testCount++;

};

basicTHREE.setNotes = function(suspenso, aprobado, notable, perfecto){

	basicTHREE.notes[0]=suspenso;
	basicTHREE.notes[1]=aprobado;
	basicTHREE.notes[2]=notable;
	basicTHREE.notes[3]=perfecto;

};

//POPUP EXPLICACIONES
	callbackExplanation = function(){
			basicTHREE.explanation[idCount][0] = document.getElementsByClassName('personal-header')[0].innerHTML;
			basicTHREE.explanation[idCount][1] = document.getElementsByClassName('personal-body')[0].innerHTML;;
			basicTHREE.explanation[idCount][2] = document.getElementsByClassName('personal-footer')[0].innerHTML;;
			idCount++;
			document.getElementsByClassName('aux')[0].remove();

	};



	basicTHREE.setExplanation = function(textHead, textBody, textFoot){
		if(arguments.length==1 && ((typeof textHead)=="object")){ //Este seria el caso en el que el unico argumento es un var como indica el manual de usuario
			basicTHREE.explanation[idCount][0]=textHead[0]['head'];
			basicTHREE.explanation[idCount][1]=textHead[0]['body'];
			basicTHREE.explanation[idCount][2]=textHead[0]['foot'];
			idCount++;
		}else if(arguments.length==1 && (textHead.substring(textHead.length-5,textHead.length)==".html")){ 	//Este seria el caso de que solo hay un parametro y este parametro es un fichero de texto
			var url = textHead;
			$("body").append("<div class=\"aux\"></div>");

			$.get(url, function(data){
					$(".aux").append(data);
			});
			setTimeout(callbackExplanation, 1);
		}else{
			basicTHREE.explanation[idCount][0]=textHead;
			basicTHREE.explanation[idCount][1]=textBody;
			basicTHREE.explanation[idCount][2]=textFoot;
			idCount++;

		}


	}


	explanationPopup = function(id){

						var modal = document.getElementById('myModal');
						id = id-onlyCollidables;
						var span = document.getElementsByClassName("close")[0];
						span.onclick = function() {
		    				modal.style.display = "none";
		    			}
		    			if(document.getElementsByClassName('head-text')[0].innerHTML!=basicTHREE.explanation[id][0]){
		    				document.getElementsByClassName('head-text')[0].remove();
		    				$(".modal-header").append("<h2 class=\"head-text\">"+basicTHREE.explanation[id][0]+"</h2>");

		    			}

		    			if(document.getElementsByClassName('body-text')[0].innerHTML!=basicTHREE.explanation[id][1]){
							document.getElementsByClassName('body-text')[0].remove();
		    				$(".modal-body").append("<p class=\"body-text\">"+basicTHREE.explanation[id][1]+"</p>");

		    			}

		    			if(document.getElementsByClassName('foot-text')[0].innerHTML!=basicTHREE.explanation[id][2]){
							document.getElementsByClassName('foot-text')[0].remove();
		    				$(".modal-footer").append("<h3 class=\"foot-text\">"+basicTHREE.explanation[id][2]+"</h3>");

		    			}
		    			modal.style.display = "block";

	};

	popupInit = function(){
						$.get("popup3.html", function(data){

							if(document.getElementById('myModal')==null)
								$("body").append(data);

							if(document.getElementsByClassName('head-text')[0]==null)
								$(".modal-header").append("<h2 class=\"head-text\">"+basicTHREE.explanation[0][0]+"</h2>");

							if(document.getElementsByClassName('body-text')[0]==null)
								$(".modal-body").append("<p class=\"body-text\">"+basicTHREE.explanation[0][1]+"</p>");

							if(document.getElementsByClassName('foot-text')[0]==null)
								$(".modal-footer").append("<h3 class=\"foot-text\">"+basicTHREE.explanation[0][2]+"</h3>");

						});

	};

//QUESTION POPUP
	basicTHREE.setQuestion = function(testQuestion){

		for(var i=0; i<testQuestion.length; i++){
			question[idCount][i] = testQuestion[i];
			if(testQuestion[i]['enunciado']!=undefined){
				question[idCount][i] = testQuestion[i];
			}
		}			

		idCount++;
	};
	handleyKeyPress = function(currentID, type){
		if(type==1 || type==10){
			var aux = $("#questionInput").val();
			var actual = 0;
			for(var i=0; i<question[currentID][currentQ]['correct'].length;i++)
				if(question[currentID][currentQ]['correct'][i]==aux[i])
					actual++;
			questionScore=questionScore+actual;
			if(actual>(question[currentID][currentQ]['correct'].length/2))				
				$("#Message").append("<strong id=\"correctMessage\">BIEN</strong>");
			else
				$("#Message").append("<strong id=\"incorrectMessage\">MAL</strong>");
			if(type==10){
				type=2;
				if(currentQ==questionLong[currentID]-1){endQuestion(currentID, type)}else{setTimeout(nextQuestion(currentID, type),3000);}
			}
		}else if(type==2){
			document.getElementById('audio').loop=false;
			audio = document.getElementById('audio');
			standbyID = currentID;
			audio.addEventListener('ended', function(){
				handleyKeyPress(standbyID, 10);

			}, false);
			audio.play();

		}else{

			if($("#questionInput").val() == question[currentID][currentQ]['correct']){
				$("#Message").append("<strong id=\"correctMessage\">BIEN</strong>");
				questionScore++;
			}else{
				$("#Message").append("<strong id=\"incorrectMessage\">MAL</strong>");
			}
		}
		if(type!=2)
			if(currentQ==questionLong[currentID]-1){endQuestion(currentID, type)}else{setTimeout(nextQuestion(currentID, type),3000);}

	};
	questionInit = function(){

		if(document.getElementById('question')==null){

			$("body").append(" <div id = \"question\" role = \"content\" class = \"question\"><span id=\"endQ\">Cerrar</span><br>");
			$("style").append("textArea{overflow-y:scroll;max-width:500px;max-height:200px;}#bSubmit{background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: left;text-decoration: none;display: inline-block; font-size: 16px;}#title-question{text-align:center;}#Message{text-align:center;}#question-block,ol,ul{list-style:none}#question-block,h1,h2{padding:0}#question-block,.choice-box,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}b,body,code,div,h1,h2,h3,h4,h5,h6,html,i,p,small,span,strike,strong,sub,sup,u{border:0;font:inherit;vertical-align:baseline;margin:0;padding:0}body{line-height:1;font:400 .9em/1em\"Helvetica Neue\",Helvetica,Arial,sans-serif}strong{font-weight:700;}#question{max-width:620px;border:1px solid #ccc;background:#fff;padding:10px;margin:3px}h1{font:normal 700 2em/1.8em\"Helvetica Neue\",Helvetica,Arial,sans-serif;text-align:left;border-bottom:1px solid #999;width:auto}.choice-box,h2{text-align:center}h2{font:italic 700 1.3em/1.2em\"Helvetica Neue\",Helvetica,Arial,sans-serif;margin:20px 0}p.pager{margin:5px 0;font:700 1em/1em\"Helvetica Neue\",Helvetica,Arial,sans-serif;color:#999}img.question-image{display:block;max-width:250px;margin:10px auto;border:1px solid #ccc;width:100%;height:auto}#question-block{margin:0}#submitbutton{background:#5a6b8c}#submitbutton:hover{background:#7b8da6}#correctMessage{margin:0 auto;padding:20px;width:75%;color:green;}#incorrectMessage{margin:0 auto;padding:20px;width:75%;color:red;}.choice-box{margin:8px auto;padding:10px 0;border:1px solid #666;cursor:pointer;-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px}#endQ,#question{display:none}#question{position:fixed;z-index:1;padding-top:100px;left:500px;top:0;width:100%;height:100%;overflow:auto;background-color:#fff}#endQ{color:#000;float:right;font-size:15px;font-weight:700}#endQ:focus,#endQ:hover{color:#000;text-decoration:none;cursor:pointer}");

		}

	};

	questionPopup = function(id, type=0){
		id = id-onlyCollidables;
		questionLong[id]=0;
		if(type!=0)maxScoreC=0;
	    for(var i = 0; question[id][i]!=undefined; i++){
	    	if(question[id][i]['enunciado']!=undefined){
	       		questionLong[id]=questionLong[id]+1;
	       		if(type!=0)maxScoreC = maxScoreC+question[id][i]['correct'].length;
	    	}
	    }
		var frame = document.getElementById('question');
		var endQ = document.getElementById('endQ');
		if(!frame) {

				questionInit();
				frame = document.getElementById('frame');
				end = document.getElementById('end');
			
		}
		endQ.onclick = function(){
			frame.style.display = "none";
			frame.remove();
		}
		frame.style.display = "block";
		endQ.style.display = "block";
		if(document.getElementById('question-block')==null){
			$("#question").append("<h1 id=\"title-question\">QUESTION</h1><br><br><div id=\"question-block\"><div id=\"questionText\"></div><br></div><div id=\"Message\"></div><div id=\"incorrectMessage\"></div>");
			if(question[id][currentQ]['ref']!="" && question[id][currentQ]['ref']!=undefined )
				$('#questionText').append("<img style=\"max-height: 500px; max-width: 500px;\" src=\""+ question[id][currentQ]['ref'] +"\"><br>")
			$("#questionText").append(question[id][currentQ]["enunciado"]);
			if(type==1){
				$("#question-block").append("<div class=\"answer\"><textArea id=\"questionInput\" type=\"text\" cols=\"40\" rows=\"5\"></textArea><br><br><button id=\"bSubmit\" onclick=\"handleyKeyPress("+id+","+type+")\">He terminado!</button></div>");
			}else if(type==2){
				$("#question-block").append("<div class=\"answer\"><textArea id=\"questionInput\" type=\"text\" cols=\"40\" rows=\"5\"></textArea><br><br><audio id=\"audio\" src=\""+question[id][currentQ]['audio']+"\"></audio><button id=\"bSubmit\" onclick=\"handleyKeyPress("+id+","+type+")\">Play!</button></div>");
			}else{
				$("#question-block").append("<div class=\"answer\"><input id=\"questionInput\" type=\"text\" autofocus><br><br><button id=\"bSubmit\" onclick=\"handleyKeyPress("+id+","+type+")\">He terminado!</button></div>");
			}
		}
	};

	nextQuestion = function(id, type){
		currentQ++;
		$('#questionText').empty();
		$('#answer').empty();
		$("#Message").empty();
		$('#questionInput').val(null);
		$("#questionText").append(question[id][currentQ]['enunciado']);
		if(type==1)
			$("#answer").append("<textArea id=\"questionInput\" type=\"text\" cols=\"40\" rows=\"5\"></textArea><br><br><button id=\"bSubmit\" onclick=\"handleyKeyPress("+id+","+type+")\">He terminado!</button>");
		else if(type==2)
			$("#answer").append("<input id=\"questionInput\" type=\"text\" autofocus><br><br><button id=\"bSubmit\" onclick=\"handleyKeyPress("+id+","+type+")\">He terminado!</button>");
		else
			$("#answer").append("<input id=\"questionInput\" type=\"text\" autofocus><br><br><button id=\"bSubmit\" onclick=\"handleyKeyPress("+id+","+type+")\">He terminado!</button>");


	};

	endQuestion = function(id,type){

		$('#questionText').empty();
		$('#questionInput').remove();
		$('#bSubmit').remove();
		$('#Message').empty();
		if(type==1 || type==2){
			$('#questionText').append("Has finalizado esta prueba. <strong>Felicidades!</strong><br>Has acertado "+ questionScore +" de "+ maxScoreC + "<br>");
			$('#question-block').append("<center><a font-size=\'4em\'>Tu nota es un <h2>"+ Math.round(questionScore / maxScoreC * 10) +"</h2></a></center>");
	         var result = Math.round(questionScore / maxScoreC * 100);

		         if(result < 33){
	         		$('#question-block').append("<center><img height=\"200px\" width=\"200px\" margin-left=\"40%\" src=\""+ basicTHREE.notes[0] +"\"></center>");
		         }
		         else if(result < 67){
	         		$('#question-block').append("<center><img height=\"200px\" width=\"200px\" margin-left=\"40%\" src=\""+ basicTHREE.notes[1] +"\"></center>");
		         }
		          else if(result < 100){
	         		$('#question-block').append("<center><img height=\"200px\" width=\"200px\" margin-left=\"40%\" src=\""+ basicTHREE.notes[2] +"\"></center>");
		         }
		         else if(result == 100){
		         	$('#question-block').append("<center><img height=\"200px\" width=\"200px\" margin-left=\"40%\" src=\""+ basicTHREE.notes[3] +"\"></center>");
		         }
	     			

		}else{
			$('#questionText').append("Has finalizado esta prueba. <strong>Felicidades!</strong><br>Has acertado "+ questionScore +" de "+ questionLong[id]+ "<br>");
			$('#question-block').append("<center><a font-size=\'4em\'>Tu nota es un <h2>"+ Math.round(questionScore / questionLong[id] * 10) +"</h2></a></center>");
	         var result = Math.round(questionScore / questionLong[id] * 100);

		         if(result < 33){
	         		$('#question-block').append("<center><img height=\"200px\" width=\"200px\" margin-left=\"40%\" src=\""+ basicTHREE.notes[0] +"\"></center>");
		         }
		         else if(result < 67){
	         		$('#question-block').append("<center><img height=\"200px\" width=\"200px\" margin-left=\"40%\" src=\""+ basicTHREE.notes[1] +"\"></center>");
		         }
		          else if(result < 100){
	         		$('#question-block').append("<center><img height=\"200px\" width=\"200px\" margin-left=\"40%\" src=\""+ basicTHREE.notes[2] +"\"></center>");
		         }
		         else if(result == 100){
		         	$('#question-block').append("<center><img height=\"200px\" width=\"200px\" margin-left=\"40%\" src=\""+ basicTHREE.notes[3] +"\"></center>");
		         }
	     }
	};

//COPIADO EXERCISE

copiadoTest = function(id){

	questionPopup(id, 1);

};

dictadoTest = function(id){
	questionPopup(id, 2);

};
//TEST POPUP



	basicTHREE.setQuiz = function(testQuiz){
		if(quiz[idCount]==undefined)
			quiz[idCount]= [];
		for(var i=0; i<testQuiz.length; i++){
			quiz[idCount][i]=testQuiz[i];
		}
		idCount++;
	};

	quizInit = function(){

		if(document.getElementById('frame')==null){
			$("body").append("<div id = \"frame\" role = \"content\" class = \"Quizz\"><span id=\"end\">Cerrar</span></div>");
			$("style").append("body{overflow:hidden}#choice-block,ol,ul{list-style:none}#choice-block,h1,h2{padding:0}#choice-block,.choice-box,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}b,body,code,div,h1,h2,h3,h4,h5,h6,html,i,p,small,span,strike,strong,sub,sup,u{border:0;font:inherit;vertical-align:baseline;margin:0;padding:0}body{line-height:1;font:400 .9em/1em\"Helvetica Neue\",Helvetica,Arial,sans-serif}strong{font-weight:700}#frame{max-width:620px;border:1px solid #ccc;background:#fff;padding:10px;margin:3px}h1{font:normal 700 2em/1.8em\"Helvetica Neue\",Helvetica,Arial,sans-serif;text-align:left;border-bottom:1px solid #999;width:auto}.choice-box,h2{text-align:center}h2{font:italic 700 1.3em/1.2em\"Helvetica Neue\",Helvetica,Arial,sans-serif;margin:20px 0}p.pager{margin:5px 0;font:700 1em/1em\"Helvetica Neue\",Helvetica,Arial,sans-serif;color:#999}img.question-image{display:block;max-width:250px;margin:10px auto;border:1px solid #ccc;width:100%;height:auto}#choice-block{margin:0}#submitbutton{background:#5a6b8c}#submitbutton:hover{background:#7b8da6}#explanation{margin:0 auto;padding:20px;width:75%}.choice-box{margin:8px auto;padding:10px 0;border:1px solid #666;cursor:pointer;-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px}#end,#frame{display:none}#frame{position:fixed;z-index:1;padding-top:100px;left:500px;top:0;width:100%;height:100%;overflow:auto;background-color:#fff}#end{color:#000;float:right;font-size:15px;font-weight:700}#end:focus,#end:hover{color:#000;text-decoration:none;cursor:pointer}");
		}


	};
	quizTest = function(id){
	 id = id-onlyCollidables;

	 var longitud = 0;

	 var currentquestion = 0,
	     score = 0,
	     submt = true,
	     picked;
		var frame = document.getElementById('frame');
		var end = document.getElementById('end');

		if(!frame) {

				quizInit();
				frame = document.getElementById('frame');
				end = document.getElementById('end');
				initCount=0;
			
		}
		end.onclick = function(){

			frame.style.display = "none";
			frame.remove();
		}
		frame.style.display = "block";
		end.style.display = "block";

	     $(document).ready(function(){
	       $("#submitbutton").hide();

	     function htmlEncode(value) {
	         return $(document.createElement('div')).text(value).html();
	     }


	     function addChoices(choices) {
	         if (typeof choices !== "undefined" && $.type(choices) == "array") {
	             $('#choice-block').empty();
	             for (var i = 0; i < choices.length; i++) {
	                 $(document.createElement('li')).addClass('choice choice-box').attr('data-index', i).text(choices[i]).appendTo('#choice-block');
	             }
	         }
	     }

	     function nextQuestion() {
	         submt = true;
	         //alert("nQ");
	         $('#explanation').empty();
	         $('#questionQ').empty();
	         $('#questionQ').append(quiz[id][currentquestion]['question']);
	         $('#pager').text('Question ' + Number(currentquestion + 1) + ' of ' + longitud);
	         if (quiz[id][currentquestion].hasOwnProperty('image') && quiz[id][currentquestion]['image'] != "") {
	             if ($('#question-image').length == 0) {
	                 $(document.createElement('img')).addClass('question-image').attr('id', 'question-image').attr('src', quiz[id][currentquestion]['image']).attr('alt', htmlEncode(quiz[id][currentquestion]['question'])).insertAfter('#question');
	             } else {
	                 $('#question-image').attr('src', quiz[id][currentquestion]['image']).attr('alt', htmlEncode(quiz[id][currentquestion]['question']));
	             }
	         } else {
	             $('#question-image').remove();
	         }
	         addChoices(quiz[id][currentquestion]['choices']);
	         setupButtons();


	     }


	     function processQuestion() {

	         //alert(choice);
	         currentquestion++;
	          //alert(currentquestion);
	         $("#submitbutton").hide();

	             if (currentquestion == longitud) {
	                 endQuiz();
	             } else {

	                 nextQuestion();
	             }

	     }


	     function setupButtons() {
	         $('.choice').on('mouseover', function () {
	             $(this).css({
	                 'background-color': '#e1e1e1'
	             });
	         });
	         $('.choice').on('mouseout', function () {
	             $(this).css({
	                 'background-color': '#fff'
	             });
	         })
	         $('.choice').on('click', function () {
	             //alert("");
	             choice = $(this).attr('data-index');
	             $('.choice').removeAttr('style').off('mouseout mouseover');
	             $(this).css({
	                 'border-color': '#222',
	                 'font-weight': 700,
	                 'background-color': '#c1c1c1'
	             });
	             if (quiz[id][currentquestion]['choices'][choice] == quiz[id][currentquestion]['correct']) {
	             $('.choice').eq(choice).css({
	                 'background-color': '#50D943'
	             });
	             $('#explanation').html('<strong>Correct!</strong> ' + htmlEncode(quiz[id][currentquestion]['explanation']));
	             score++;
	         } else {
	             $('.choice').eq(choice).css({
	                 'background-color': '#D92623'
	             });
	             $('#explanation').html('<strong>Incorrect.</strong> ' + htmlEncode(quiz[id][currentquestion]['explanation']));
	         }

	             if (submt) {
	                 //alert("submit");
	                 submt = false;

	                setTimeout(processQuestion,3000);

	             }
	         })
	     }


	     function endQuiz() {
	         $('#explanation').empty();
	         $('#questionQ').empty();
	         $('#choice-block').empty();
	         $('#submitbutton').remove();
	         $('#questionQ').text("You got " + score + " out of " + longitud + " correct.");
	         $(document.createElement('h2')).css({
	             'text-align': 'center',
	             'font-size': '4em'
	         }).text(Math.round(score / longitud * 10)).insertAfter('#questionQ');

	         var result = Math.round(score / longitud * 100);
	         var g = document.createElement('img');
	          g.id = 'imgId';
	          $(g).css({
	             'height':'100px',
	             'width': '100px',
	             'margin-left':'40%'
	         }).insertAfter('#explanation');

	         if(result < 33){
	            $("#imgId").attr("src","http://www.chaaps.com/wp-content/uploads/2010/07/fail.jpg");
	         }
	         else if(result < 67){
	            $("#imgId").attr("src","http://www.ytechie.com/2008/04/how-does-your-boss-know-youre-doing-a-great-job/good-job.png");
	         }
	          else if(result < 100){
	            $("#imgId").attr("src","http://www.ytechie.com/2008/04/how-does-your-boss-know-youre-doing-a-great-job/good-job.png");
	         }
	         else if(result == 100){
	            $("#imgId").attr("src","http://i2.photobucket.com/albums/y41/blackwelsh13/Smileys/perfect10.gif");
	         }
	     }

	     function init() {
	     	//Evito que se cree dos veces y ademas cuando se cierre y vuelvas a chocar con el objeto, continuara por donde iba
	      if(initCount==0){
	         //add title
	         if (typeof quiztitle !== "undefined" && $.type(quiztitle) === "string") {
	             $(document.createElement('h1')).text(quiztitle).appendTo('#frame');
	         } else {
	             $(document.createElement('h1')).text("Quiz").appendTo('#frame');
	         }
	         for(var i = 0; quiz[id][i]!=undefined; i++)
	         	longitud++;
			 //add pager and questions
	         if (typeof quiz[id] !== "undefined") {
	             //add pager
	             $(document.createElement('p')).addClass('pager').attr('id', 'pager').text('Question 1 of ' + longitud).appendTo('#frame');
	             //add first question
	             $("#frame").append("<h2 id=\"questionQ\">"+ quiz[id][0]['question'] +"</h2>")

	             //add image if present
	             if (quiz[id][0].hasOwnProperty('image') && quiz[0]['image'] != "") {
	                 $(document.createElement('img')).addClass('question-image').attr('id', 'question-image').attr('src', quiz[id][0]['image']).attr('alt', htmlEncode(quiz[id][0]['question'])).appendTo('#frame');
	             }

	             //questions holder
	             $(document.createElement('ul')).attr('id', 'choice-block').appendTo('#frame');

	             //add choices
	             addChoices(quiz[id][0]['choices']);

	              $(document.createElement('p')).addClass('explanation').attr('id', 'explanation').html('&nbsp;').appendTo('#frame');

	             setupButtons();

	         }
	         initCount=1;
	     }
	     }

	     init();
	 });  



}
