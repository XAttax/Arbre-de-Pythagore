$(document).ready(function() {
	var canvas = $('#canvas')[0];
	var contexte = canvas.getContext('2d');

	var POS_DEPART = {
		x: 0,
		y: 0
	}
	var NOMBRE = 0;
	var ANGLE = Math.PI/4;
	var TAILLE_DEPART = 150; // Taille du premier carré

	$(window).resize(function() {
		redimensionner();
	});

	var ajouterCarre = function(x, y, t, a) {
		var A = {
			x: x,
			y: y
		};
		var B = {
			x: A.x-Math.sin(a)*t,
			y: A.y+Math.cos(a)*t
		};
		var C = {
			x: B.x+Math.cos(a)*t,
			y: B.y+Math.sin(a)*t
		};
		var D = {
			x: A.x+Math.cos(a)*t,
			y: A.y+Math.sin(a)*t
		};

		contexte.beginPath();
		contexte.moveTo(A.x, A.y);
		contexte.lineTo(B.x, B.y);
		contexte.lineTo(C.x, C.y);
		contexte.lineTo(D.x, D.y);
		contexte.closePath();
		contexte.fill();

		return {
			A: A,
			B: B,
			C: C,
			D: D
		}
	};

	var ajouterTriangle = function(x, y, t, a) {
		// SOHCAHTOA
		// Cos = Adj / Hyp
		// Donc : Adj = Cos * Hyp
		// Tan = Opp / Adj
		// Donc : Opp = Tan * Adj

		var angleTotal = (a+ANGLE)%(Math.PI*2);

		var adj = Math.cos(ANGLE)*t;
		var opp = Math.tan(ANGLE)*adj;

		var A = {
			x: x,
			y: y
		};
		var B = {
			x: A.x+Math.cos(angleTotal)*adj,
			y: A.y+Math.sin(angleTotal)*adj
		};
		var C = {
			x: A.x+Math.cos(a)*t,
			y: A.y+Math.sin(a)*t
		};

		contexte.beginPath();
		contexte.moveTo(A.x, A.y);
		contexte.lineTo(B.x, B.y);
		contexte.lineTo(C.x, C.y);
		contexte.closePath();
		contexte.fill();

		/*contexte.fillRect(A.x,A.y,10,10);
		contexte.fillRect(B.x,B.y,10,10);
		contexte.fillRect(C.x,C.y,10,10);*/

		return {
			A: A,
			B: B,
			C: C,
			adj: adj,
			opp: opp
		}
	};

	var ajouterElement = function(n, x, y, t, a) {

		var a = a%(Math.PI*2); // Angle

		contexte.fillStyle = 'rgba(0, 0, 0, 0.5)';
		var pointsCarr = ajouterCarre(x, y, t, a);
		contexte.fillStyle = 'rgba(0, 255, 0, 0.5)';
		var pointsTri = ajouterTriangle(pointsCarr.B.x, pointsCarr.B.y, t, a);

		if(n < NOMBRE) {
			ajouterElement(n+1, pointsTri.A.x, pointsTri.A.y, pointsTri.adj, a+ANGLE);
			ajouterElement(n+1, pointsTri.B.x, pointsTri.B.y, pointsTri.opp, a-Math.PI/2+ANGLE);
		}
	};

	var dessiner = function() {
		contexte.clearRect(0, 0, canvas.width, canvas.height);
		contexte.resetTransform();
		contexte.transform(1, 0, 0, -1, 0, canvas.height);

		ajouterElement(0, POS_DEPART.x, POS_DEPART.y, TAILLE_DEPART, 0);

		$('span.nombreCarre span.valeur').html(Math.pow(2, NOMBRE+1)-1);
	};

	var redimensionner = function() {
		canvas.width = $(window).width();
		canvas.height = $(window).height();

		POS_DEPART.x = canvas.width/2-TAILLE_DEPART/2;
		POS_DEPART.y = 50;

		dessiner();
	};

	redimensionner();

	// Gestions formulaire //

	$('input[name=angle]').on('input', function() {
		valeur = $(this).val();
		$('span.infos.angle').html('[ ' + valeur + ' ]');
		ANGLE = valeur * Math.PI / 180;

		dessiner();
	});

	$('input[name=nombre]').on('input', function() {
		valeur = $(this).val();
		$('span.infos.nombre').html('[ ' + valeur + ' ]');
		NOMBRE = valeur-1;

		dessiner();
	});

	$('input[name=taille]').on('input', function() {
		valeur = $(this).val();
		$('span.infos.taille').html('[ ' + valeur + 'px ]');
		TAILLE_DEPART = valeur;

		dessiner();
	});
});