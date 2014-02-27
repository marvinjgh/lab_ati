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
        post = {nombre: "", mensaje: ""};
    } else {
        $("#delete").removeClass("invisible");
    }
    form = document.getElementById("formulario"); //$("#formulario");
    form.reset();
    form.nombre.value = post.nombre;
    form.mensaje.value = post.mensaje;
}
function error(datos) {
    $("#dinamico").removeClass("invisible");
    $("#postid").addClass("invisible");
    var myroot = $("#dinamico"); //document.getElementById("contenido");
    myroot.html('');
    salida = "<p>ERROR " + datos.status + "<br>Ocurrio un error con la solicitud disculpe los inconvenientes</p>";
    html = $.parseHTML(salida);
    myroot.append(html);
}
$("#inicio").click(function(event) {
    pagina = 0;
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
});
$("#next").click(function(event) {
    pagina++;
    $("#pagina").html(pagina);
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
    $("#pagina").html(pagina);
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
function cargarInicio() {
    pagina = 0;
    $("#pagina").html(pagina);
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
$("form").on("submit", function(event) {
    event.preventDefault();
    var val = $("input[type=submit][clicked=true]").attr("id");
    if (val === "save") {
        if (sel_post === null) {
            $.ajax({url: "http://www.ciens.ucv.ve/post",
                type: "POST",
                data: $(this).serialize(),
                statusCode: {
                    400: error,
                    404: error,
                    201: cargarInicio,
                    500: error
                }
            }
            );
        } else {
            if (sel_post.nombre === this.nombre.value && sel_post.mensaje === this.mensaje.value) {
                cargarInicio();
            } else if (sel_post.nombre !== this.nombre.value && sel_post.mensaje !== this.mensaje.value) {
                $.ajax({url: "http://www.ciens.ucv.ve" + sel_post.id,
                    type: "PUT",
                    data: $(this).serialize(),
                    statusCode: {
                        400: error,
                        404: error,
                        201: cargarInicio,
                        500: error
                    }
                }
                );
            } else {
                alert("modificado uno de los elementos");
                $.ajax({url: "http://www.ciens.ucv.ve" + sel_post.id,
                    type: "PATCH",
                    data: (sel_post.nombre !== this.nombre.value) ? "nombre=" + this.nombre.value : "mensaje=" + this.mensaje.value,
                    statusCode: {
                        400: error,
                        404: error,
                        200: cargarInicio,
                        500: error
                    }
                }
                );
            }
        }
    } else {
        $.ajax({url: "http://www.ciens.ucv.ve" + sel_post.id,
            type: "DELETE",
            statusCode: {
                400: error,
                404: error,
                204: cargarInicio,
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
$("#cancel").click(function() {
    cargarInicio();
});
$("#new").click(function() {
    sel_post = null;
    cargarPost(null);
});
$(document).ready(function() {
    var elements = document.getElementsByTagName("INPUT");
    for (var i = 0; i < elements.length; i++) {
        elements[i].oninvalid = function(e) {
            e.target.setCustomValidity("");
            if (!e.target.validity.valid) {
                if (e.target.value === "")
                    e.target.setCustomValidity("No puede ser vacio");
                else {
                    e.target.setCustomValidity("otra vaina");
                }
            }
        };
        elements[i].oninput = function(e) {
            e.target.setCustomValidity("");
        };
    }
    document.getElementsByTagName("textarea")[0].oninvalid = function(e) {
        e.target.setCustomValidity("");
        if (!e.target.validity.valid) {
            e.target.setCustomValidity("No puede ser vacio");
        } else {
            e.target.setCustomValidity("otra vaina");
        }
    };
    document.getElementsByTagName("textarea")[0].oninput = function(e) {
        e.target.setCustomValidity("");
    };
    cargarInicio();
});
$("form input[type=submit]").click(function() {
    $("input[type=submit]", $(this).parents("form")).removeAttr("clicked");
    $(this).attr("clicked", "true");
});