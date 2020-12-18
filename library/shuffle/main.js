

var Shuffle = window.Shuffle;
var element = document.querySelector('.my-shuffle-container');
console.log(element);
var sizer = element.querySelector('.my-sizer-element');
console.log(sizer);

var shuffleInstance = new Shuffle(element, {
  itemSelector: '.picture-item',
  sizer: sizer // could also be a selector: '.my-sizer-element'
});
// shuffleInstance.filter('discapacidad');
$("#all").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter();
});
$("#btn-discapacidad").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter('discapacidad');
});
$("#btn-evaluaciones").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter('evaluaciones');
});
$("#btn-formacionProfesional").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter('formacionProfesional');
});
$("#btn-formacionProfesional").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter('formacionProfesional');
});
$("#btn-mediosComunicacion").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter('mediosComunicacion');
});
$("#btn-personal").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter('personal');
});
$("#btn-premios").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter('premios');
});
$("#btn-servicioPsicologico").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter('servicioPsicologico');
});
$("#btn-talleres").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter('talleres');
});
$("#btn-terapiaPsicoLinea").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter('terapiaPsicoLinea');
});
$("#btn-terapiaPsicopedagogica").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter('terapiaPsicopedagogica');
});
$("#btn-terapiaPsicopedagogicaLinea").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter('terapiaPsicopedagogicaLinea');
});
$("#btn-terapiaLenguaje").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter('terapiaLenguaje');
});

$("#btn-terapiaLenguajeLinea").on("click", function(e){
   e.preventDefault();
   shuffleInstance.filter('terapiaLenguajeLinea');
});




