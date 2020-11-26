$(document).ready(function () {
	var config = {
		apiKey: "AIzaSyCtRGjgiHHuSs2PThsrw_9-Gf3fF8dRmjY",
		authDomain: "psico-5c9a8.firebaseapp.com",
		databaseURL: "https://psico-5c9a8.firebaseio.com",
		projectId: "psico-5c9a8",
		storageBucket: "psico-5c9a8.appspot.com",
		messagingSenderId: "341532656354",
		appId: "1:341532656354:web:c30c76cc701f5c9fab54bb"
	};

	if (!firebase.apps.length) {
		firebase.initializeApp(config);
	}

	const storage = firebase.storage();
	const ref = storage.ref();
	const db = firebase.firestore();

	$("body").on("click", ".btn_modal", function () {
		let action = $(this).attr("data-action");
		$("#modal_agendar").removeClass(action === "open" ? "close" : "open");
		$("#modal_agendar").addClass(action === "open" ? "open" : "close");
		$("body").removeClass(action === "open" ? "scrool" : "noscroll");
		$("body").addClass(action === "open" ? "noscrool" : "scrool");

		if (action === "close") {
			$("#ag_body").find("input").val("");
			$("#ag_body").find("select").val(null);
			$(".btn_cita").attr("data-selected", "false");
			$(".btn_cita").removeClass("selected");
			$("#ag_preview").css("background-image", "none");
			$("#ag_comprobante").val("");
		}
	});

	$("body").on("click", ".btn_file", function () {
		let input = $(this).attr("data-input");
		$("#" + input).click();
	});

	$("#ag_type_medio").change(function () {
		let valor = $(this).val();
		if (valor === "fb") {
			$("#ag_type_profile").attr("placeholder", "URl a tu perfil de Facebook");
			$("#ag_type_profile").removeAttr("disabled");
			$("#ag_type_profile").val("");
		} else {
			$("#ag_type_profile").attr("placeholder", "Usuario de Skype");
			$("#ag_type_profile").removeAttr("disabled");
			$("#ag_type_profile").val("");
		}
	});

	$("body").on("click", ".btn_cita", function () {
		$(".btn_cita").attr("data-selected", "false");
		$(".btn_cita").removeClass("selected");
		$(this).attr("data-selected", "true");
		$(this).addClass("selected");
	});

	$("#ag_comprobante").change(function () {
		let inp = $(this);
		let input = this;
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.readAsDataURL(input.files[0]);
			reader.onload = function (e) {
				$("#ag_preview").css(
					"background-image",
					"url(" + e.target.result + ")"
				);
				$("#ag_preview").css("background-size", "100% 100%");
			};
		}
	});

	function getTipoCita() {
		if ($("#ag_cita_a").attr("data-selected") === "true") {
			return 0;
		} else if ($("#ag_cita_b").attr("data-selected") === "true") {
			return 1;
		} else if ($("#ag_cita_c").attr("data-selected") === "true") {
			return 2;
		} else if ($("#ag_cita_d").attr("data-selected") === "true") {
			return 3;
		} else {
			return -1;
		}
	}

	function getJson() {
		let data = {
			names: $("#ag_names").val(),
			surnames: $("#ag_surnames").val(),
			cedula: $("#ag_cedula").val(),
			phone: $("#ag_phone").val(),
			email: $("#ag_correo").val(),
			medio: $("#ag_type_medio").val(),
			profile: $("#ag_type_profile").val(),
			cita: {
				value: getTipoCita(),
				date: $("#ag_cita_date").val(),
				time: $("#ag_cita_time").val()
			},
			pago: ""
			/*  ag_comprobante */
		};
		return data;
	}

	function cleanStatus() {
		$("#status").removeClass("error");
		$("#status").removeClass("wait");
		$("#status").removeClass("done");
		$("#status_texto").text("");
		$("#status").removeClass("active");
		$("#ag_body").addClass("nostatus");
	}

	function setStatus(tipo, text) {
		cleanStatus();
		$("#status_texto").text(text);
		$("#status").addClass(tipo);
		$("#status").addClass("active");
		$("#ag_body").removeClass("nostatus");
	}

	$("#close_status").click(function () {
		$("#status_texto").text("");
		$("#status").removeClass("error");
		$("#status").removeClass("wait");
		$("#status").removeClass("done");
		$("#status").removeClass("active");
		$("#ag_body").addClass("nostatus");
	});

	function validarCampos({
		names,
		surnames,
		cedula,
		phone,
		email,
		medio,
		profile,
		cita
	}) {
		let res = false;
		if (names.length <= 0) {
			setStatus("error", "Error, debes ingresar tus nombres");
		} else if (surnames.length <= 0) {
			setStatus("error", "Error, debes ingresar tus apellidos");
		} else if (cedula.length <= 0) {
			setStatus("error", "Error, debes ingresar tu cédula");
		} else if (phone.length <= 0) {
			setStatus("error", "Error, debes ingresar tu teléfono");
		} else if (email.length <= 0) {
			setStatus("error", "Error, debes ingresar tu email");
		} else if (medio === null) {
			setStatus(
				"error",
				"Error, debes seleccionar una plataforma para la video llamada"
			);
		} else if (profile.length <= 0) {
			setStatus(
				"error",
				"Error, debes ingresar la url a tu perfil de FB o usuario de Skype según tu elección"
			);
		} else if (cita.value < 0) {
			setStatus("error", "Error, debes seleccionar el tipo de cita a agendar");
		} else if (cita.date.length <= 0) {
			setStatus("error", "Error, debes seleccionar la fecha para la cita");
		} else if (cita.time === null) {
			setStatus("error", "Error, debes seleccionar la hora para la cita");
		} else if (
			!($("#ag_comprobante")[0].files && $("#ag_comprobante")[0].files[0])
		) {
			setStatus(
				"error",
				"Error, debes seleccionar la foto del comprobante de la transferencia"
			);
		} else {
			res = true;
		}
		return res;
	}

	$("#btn_agendar_done").click(async function () {
		let data = getJson();
		if (validarCampos(data)) {
			setStatus("wait", "Espere por favor...");
			$(".ag_item").addClass("disabled");
			//UploadFile to Storage
			let file = $("#ag_comprobante")[0].files[0];
			let snapshot = await ref.child("comprobantes/"+data.cita.date+"/" + file.name).put(file);
			let url = await snapshot.ref.getDownloadURL();
			data.pago = url;
			//Send email
			let d = await $.ajax({
                url: "https://us-central1-psico-5c9a8.cloudfunctions.net/agendarCita",
                type: "POST",
                cache: false,
                dataType:'json',
                data: {
                    data: JSON.stringify(data)
                }
			});
			setStatus(d.code === 0 ? "done" : "error", d.data);
			$(".ag_item").removeClass("disabled");
			if (d.code === 0) {
				$("#ag_body").find("input").val("");
				$("#ag_body").find("select").val(null);
				$(".btn_cita").attr("data-selected", "false");
				$(".btn_cita").removeClass("selected");
				$("#ag_preview").css("background-image", "none");
				$("#ag_comprobante").val("");
			}

		}
	});
});