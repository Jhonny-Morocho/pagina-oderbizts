window.addEventListener('load', initMAPA, false);
function initMAPA() {
    // The map, centered at United State - America
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 18, center: {lat: -0.164823, lng: -78.487394}});
    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        position: {lat: -0.164823, lng: -78.487394},
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<img src="img/inicio/logo.png" style="width:20vw;height:auto;">');
        infowindow.open(map, this);
    });
}
//const server_url = 'http://localhost:5001/psico-5c9a8/us-central1/sendEmail';
const server_url = 'https://us-central1-psico-5c9a8.cloudfunctions.net/sendEmail';

$(document).ready(function () {
    $('.modal').modal();
    
    $(window).scroll(function() {
        let position = $(window).scrollTop();

        //Validar item menu activo
        let a = Math.round($('#inicio').offset().top);
        let b = Math.round($('#nosotros').offset().top - 50);
        let c = Math.round($('#servicios').offset().top - 50);
        let d = Math.round($('#perfil').offset().top - 50);
        let e = Math.round($('#galeria').offset().top - 50);
        let f = Math.round($('#contacto').offset().top - 50);

        $('.btn_nav').removeClass('active');
        if(position < b) { //Inicio
            $('#btn_inicio').addClass('active');
        }else if(position >= b && position < c){
            $('#btn_nosotros').addClass('active');
        }else if(position >= c && position < d){
            $('#btn_servicios').addClass('active');
        }else if(position >= d && position < e){
            $('#btn_perfil').addClass('active');
        }else if(position >= e && position< f){
            $('#btn_galeria').addClass('active');
        }else if(position >= f){
            $('#btn_contacto').addClass('active');
        }
    });

    function animateScroll(el, ms, adding){
        var speed = (ms) ? ms : 600;
        $('html,body').animate({
            scrollTop: Math.round($(el).offset().top - adding)
        }, speed);
    }

    $('body').on('click', '.btn_nav', function(e){
        let target = $(this).attr('data-target');
        if(target == 'inicio') {
            animateScroll('#inicio', 600, 50);
        } else if(target == 'nosotros'){
            animateScroll('#nosotros', 600, 50);
        } else if(target == 'servicios'){
            animateScroll('#servicios', 600, 50);
        } else if(target == 'perfil'){
            animateScroll('#perfil', 600, 50);
        } else if(target == 'galeria'){
            animateScroll('#galeria', 600, 50);
        } else if(target == 'contacto'){
            animateScroll('#contacto', 600, 50);
        }

        e.preventDefault();
    });
    var contador = 1;
    $('body').on('click', '.btn_slider_intro', function(){
        let slider = $(this).attr('data-target');
        contador = parseInt(slider);
        $('.btn_slider_intro').removeClass('active');
        $(this).addClass('active');

        //Mover sliders
        $('.slide').removeClass('active');
        $('#slide_a_'+slider).addClass('active');
    });
    
    setInterval(function(){
        if(contador == 4) {
            contador = 1;
        }else{
            contador += 1;
        }
        $('#btn_'+contador).click();
    }, 8000, contador);

    var color = {
        aa: '#f6d503',
        a: '#7d4797',
        b: '#d4df00',
        c: '#fa8f6f',
        d: '#ffb400',
        e: '#932492'
    };

    var imagenes = {
        aa: 'img/servicios/fondo.jpg',
        a: 'img/servicios/a.jpg',
        b: 'img/servicios/b.jpg',
        c: 'img/servicios/c.jpg',
        d: 'img/servicios/d.jpg',
        e: 'img/servicios/e.jpg',
    };

    $('#contenedor_btns .btn_servicios').mouseover(function(){
        let id = $(this).attr('name');
        $('#contenedor_textos .texto').removeClass('active');
        $('#contenedor_textos .texto.'+id).addClass('active');
        $('#color_servicio').css('background', color[''+id]);
        $('#imagen_servicio').attr('src', imagenes[''+id]);
    });

    $('#contenedor_btns .btn_servicios').mouseleave(function() {
        $('#contenedor_textos .texto').removeClass('active');
        $('#contenedor_textos .texto.aa').addClass('active');
        $('#color_servicio').css('background', color['aa']);
        $('#imagen_servicio').attr('src', imagenes['aa']);
    });

     /*SEND email of contact*/
     $('#send_email').click(()=>{
         $('#send_email').addClass('noactive');
        let nombre = $('#nombre').val();
        let telefono = $('#telefono').val();
        let pregunta = $('#pregunta').val();
        let val = false;
        if(nombre.length>=8){
            if(telefono.length>=9){
                if (pregunta.length > 0) {
                    val = true;
                }else{
                    $('#send_email').removeClass('noactive');
                    M.toast({html: 'Error, debes ingresar tu pregunta', classes: 'rounded', displayLength: '1300'});
                }
            }else{
                $('#send_email').removeClass('noactive');
                M.toast({html: 'Error, debes ingresar un número de teléfono valido', classes: 'rounded', displayLength: '1300'});
            }
        }else{
            $('#send_email').removeClass('noactive');
            M.toast({html: 'Error, debes ingresar tu nombre', classes: 'rounded', displayLength: '1300'});
        }
        if(val){
            $.ajax({
                url: server_url,
                type:"POST",
                cache:false,
                dataType:'json',
                data: {nombre:nombre,telefono:telefono,pregunta:pregunta}
            }).done(function (data) {
                if(data.code==0){
                    /*Tomar accionaes cuando el email se envia*/   
                    $('#formulario').find('input, textarea').val('');
                }
                M.toast({html:data.data, classes:'rounded'});
                $('#send_email').removeClass('noactive');
            }).fail(function (jqXHR, textStatus, errorThrown) {
                $('#send_email').removeClass('noactive');
                //Validar error y dar control de errores : status
                if (jqXHR.status === 0) {
                    alert('Not connect: Verify Network.');
                } else if (jqXHR.status == 404) {
                    alert('Requested page not found [404]');
                } else if (jqXHR.status == 500) {
                    alert('Internal Server Error [500].');
                } else if (textStatus === 'parsererror') {
                    alert('Requested JSON parse failed.');
                } else if (textStatus === 'timeout') {
                    alert('Time out error.');
                } else if (textStatus === 'abort') {
                    alert('Ajax request aborted.');
                } else {
                    alert('Uncaught Error: ' + jqXHR.responseText);
                }
            });
        }
    });
});