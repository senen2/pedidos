/**
 * @author botpi
 */

function inicioProd()
{
	encabezado = getCookie("encabezado");
	if (encabezado==null || encabezado=="" || encabezado=="'',''")
		encabezado="'','',''";
	pagina = "pdproducto";
	leeServidor();

	IDcuentacli = getCookie("IDcuentacli"); 
	if (IDcuentacli==null)
		IDcuentacli=0;

	var IDproducto = getURLParameter('ID');
	if (IDproducto==null)
		IDproducto=1;
	ListaProductoP(IDproducto, dibujaProducto)
}

function dibujaProducto(IDproducto, datos)
{
	gdatos = datos;
	dibujaLogin(datos.cuenta);
	dibujaCatalogos(datos.catalogos, $("title").html(), datos.carro.length);
	dibujaCatalogosAbajo(datos.catalogos, $("title").html(), datos.carro.length);
	ajustaEncabezado(gdatos.cuenta);		
	document.cookie = "IDcuentaCat=" + datos.cuentaCat.ID;
	
	var cad = "", tallas = "", colores = "";
	var item = datos.producto;
	$("#imgprod").attr("src", item.imagen)
	$("#nombre").html(item.nombre);
	
	if (item.precio>0) {
		$("#precio").html("$ " + item.precio.formatMoney(0));
		$("#preciotit").show();		
	}
	else
		$("#preciotit").hide();
	
	if (item.pvm>0) {
		$("#pvm").html("$ " + item.pvm.formatMoney(0));
		$("#pvmtit").show();		
	}
	else
		$("#pvmtit").hide();
		
	$("#referencia").html(item.referencia);
	$("#descripcion").html(item.descripcion);
	//$("#IDimagen").val(item.ID);
	//$("#dir").val(datos.cuenta.dir);

	cad = "";
	if (datos.tallas.length>0) {
		$.each(datos.tallas, function(i,item) {
			cad = cad + '<option value="' + item.talla +'">' + item.talla + '</option>';
		});
		$("#talla").html(cad);
		$("#divTalla").show();
		llenaColoresxTalla();
	}	
	else {
		$("#divTalla").hide();
		if (datos.colores.length>0) {
			$.each(datos.colores, function(i,item) {
				cad = cad + '<option value="' + item.color+'">' + item.color + '</option>';
			});
			$("#color").html(cad);
			$("#divColor").show();
		}	
		else
			$("#divColor").hide();
		
	}

	if (gdatos.prevProducto>0) {
		$("#prevProd").attr("onclick", 'verProducto(' + gdatos.prevProducto + ')');
		$("#prevProd").show();		
	}
	else
		$("#prevProd").hide();
		
	if (gdatos.sigProducto>0) {
		$("#sigProd").attr("onclick", 'verProducto(' + gdatos.sigProducto + ')');		
		$("#sigProd").show();		
	}
	else
		$("#sigProd").hide();

	dibujaTitulo(datos.cuentaCat.titulo, datos.cuentaCat.ID + ".jpg");
	dibujaTituloAbajo(datos.cuentaCat.titulo, datos.cuentaCat.ID + ".jpg");
	
	var esProveedor=(datos.cuenta!=null && datos.cuenta.ID>0 && datos.cuenta.ID!=datos.cuentaCat.ID);
	
	if (esProveedor)
		$("#agregarAlCatalogo").show();
	else
		$("#agregarAlCatalogo").hide();
}

function llenaColoresxTalla()
{
	var colores, cad="";
	var talla = $("#talla").val();
	$.each(gdatos.tallas, function(i,item) {
		if (item.talla==talla) {
			colores = item.colores;
		}
	} );

	if (colores.length>0) {
		$.each(colores, function(i,item) {
			cad = cad + '<option value="' + item.color+'">' + item.color + '</option>';
		});
		$("#color").html(cad);
		$("#divColor").show();
	}	
	else
		$("#divColor").hide();
}

function agregarAlCarro()
{
	var talla=$("#talla").val(), color=$("#color").val();
	if (gdatos.tallas.length==0)
		talla="";
	if (gdatos.colores.length==0)
		color="";
	
	AgregarAlCarroP(gdatos.producto.ID, IDcuentacli, 0, talla, color, $("#cantidad").val(), -1, salir);
}

function salir()
{
	if (IDcuentacli==0)
		window.location.assign("catalogo.html?n=" + gdatos.cuentaCat.empresa);
	else
		window.location.assign("catalogocli.html?n=" + gdatos.cuentaCat.empresa);
		
}

function agregarAlCatalogo()
{
	AgregarAlCatalogoP(gdatos.cuenta.ID, gdatos.producto.ID, salir);
}

function verProducto(IDproducto)
{
	ListaProductoP(IDproducto, dibujaProducto);
}

function verBusca(datos)
{
	if (datos)
	{
		if (datos.tipo=="catalogo")
			window.location.assign("producto.html");
		else
			ListaProductoP(datos.datos, dibujaProducto); 
	}
}
