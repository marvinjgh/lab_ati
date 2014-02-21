var pagina = 0;
var sel_post = null;
function cargarPagina(datos) {
    $("#dinamico").removeClass("invisible");
    $("#postid").addClass("invisible");
    myroot = $("#dinamico");
    myroot.html('');
    salida = "";
    for (x = 0; x < datos.length; x++) {
        //var div = document.createElement("div");
        salida += "<div class=\"post\"><div class=\"nombre\">" + datos[x].nombre + "</div><div class=\"mensaje\">" + datos[x].mensaje + "</div><div class=\"fecha\">" + datos[x].ultima_modificacion + "</div></div>";
    }
    html = $.parseHTML(salida);
    $.each(html, function(i, el) {
        $(el).click(datos[i], postclick).mouseover(colocarMarco).mouseout(quitarMarco);
        myroot.append(el);
    });
}
function cargarPost(post) {
    $("#dinamico").addClass("invisible");
    $("#postid").removeClass("invisible");
    sel_post = post;
    if (post === null) {
        $("#delete").addClass("invisible");
        $("#cancel").removeClass("invisible");
        post = {nombre: "", mensaje: ""};
    } else {
        $("#delete").removeClass("invisible");
        $("#cancel").addClass("invisible");
    }
    form = document.getElementById("formulario"); //$("#formulario");
    form.nombre.value = post.nombre;
    form.msg.value = post.mensaje;
}
function error(datos) {
    var myroot = $("#dinamico"); //document.getElementById("contenido");
    myroot.html('');
    salida = "<p>ERROR " + datos.status + "<br>Ocurrio un error con la solicitud disculpe los inconvenientes</p>";
    html = $.parseHTML(salida);
    myroot.append(html);
}
$("#inicio").click(function(event) {
    $.ajax({url: "http://www.ciens.ucv.ve/post",
        type: "GET",
        data: 'page=0',
        statusCode: {
            400: error,
            404: error,
            200: cargarPagina,
            500: error
        }
    }
    );
    pagina = 0;
});
$("#next").click(function(event) {
    pagina++;
    $.ajax({url: "http://www.ciens.ucv.ve/post",
        type: "GET",
        data: 'page=' + pagina,
        statusCode: {
            400: error,
            404: error,
            200: cargarPagina,
            500: error
        }
    }
    );
});
$("#last").click(function(event) {
    if (pagina > 0)
        pagina--;
    $.ajax({url: "http://www.ciens.ucv.ve/post",
        type: "GET",
        data: 'page=' + pagina,
        statusCode: {
            400: error,
            404: error,
            200: cargarPagina,
            500: error
        }
    }
    );
});
function postclick(evento) {
    $.ajax({url: "http://www.ciens.ucv.ve" + evento.data.id,
        type: "GET",
        statusCode: {
            400: error,
            404: error,
            200: cargarPost,
            500: error
        }
    }
    );
}

$("form").on("submit", function(event) {
    event.preventDefault();
    var val = $("input[type=submit][clicked=true]").attr("id");
    console.log($(this).serialize());
    console.log(val);
    if (val === "save") {
        if (true) {//aca el validar
            if (sel_post === null) {
                alert("nuevo");
            } else {
                if (sel_post.nombre === this.nombre.value && sel_post.mensaje === this.msg.value) {
                    alert("no modificado");
                } else if (sel_post.nombre !== this.nombre.value && sel_post.mensaje !== this.msg.value) {
                    alert("modificado todo");
                }else{
                    alert("modificado uno de los elementos");
                }
            }
        }
    } else if (val === "delete") {
        alert("eliminar");
    } else {
        alert("cancela");
        $.ajax({url: "http://www.ciens.ucv.ve/post",
            type: "GET",
            data: 'page=' + pagina,
            statusCode: {
                400: error,
                404: error,
                200: cargarPagina,
                500: error
            }
        }
        );
    }

});
function colocarMarco(event) {
    $(event.currentTarget).addClass("marco");
}
function quitarMarco(event) {
    $(event.currentTarget).removeClass("marco");
}

$("#new").click(function() {
    sel_post = null;
    cargarPost(null)
});
$(document).ready(function() {
    $("#formulario").addClass("valalinerigth");
});
$("form input[type=submit]").click(function() {
    $("input[type=submit]", $(this).parents("form")).removeAttr("clicked");
    $(this).attr("clicked", "true");
});