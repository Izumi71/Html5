(function () {
  const form = document.getElementById("emailForm");
  const btn = document.getElementById("btnEnviar");
  const toast = document.getElementById("toast");
  const contador = document.getElementById("contador");
  const fields = {
    nombre: document.getElementById("nombre"),
    correo: document.getElementById("correo"),
    asunto: document.getElementById("asunto"),
    mensaje: document.getElementById("mensaje")
  };

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const NOMBRE_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

  const validators = {
    nombre(v) {
      if (!v) return "El nombre es obligatorio.";
      if (v.length < 3) return "El nombre debe tener al menos 3 caracteres.";
      if (!NOMBRE_REGEX.test(v)) return "El nombre solo puede contener letras y espacios.";
      return "";
    },
    correo(v) {
      if (!v) return "El correo es obligatorio.";
      if (!EMAIL_REGEX.test(v)) return "Ingresa un correo electrónico válido.";
      return "";
    },
    asunto(v) {
      if (!v) return "El asunto es obligatorio.";
      if (v.length < 3) return "El asunto debe tener al menos 3 caracteres.";
      return "";
    },
    mensaje(v) {
      if (!v) return "El mensaje es obligatorio.";
      if (v.length < 10) return "El mensaje debe tener al menos 10 caracteres.";
      return "";
    }
  };

  function validateField(name) {
    const input = fields[name];
    const msg = validators[name](input.value.trim());
    document.querySelector(`[data-error-for="${name}"]`).textContent = msg;
    input.classList.toggle("invalid", !!msg);
    input.classList.toggle("valid", !msg);
    return !msg;
  }

  function validateForm() {
    return Object.keys(fields).map(validateField).every(Boolean);
  }

  let toastTimer;
  function showToast(text, type) {
    clearTimeout(toastTimer);
    toast.textContent = text;
    toast.className = `toast show ${type}`;
    toastTimer = setTimeout(() => toast.classList.remove("show"), 5000);
  }

  function setLoading(loading) {
    btn.disabled = loading;
    btn.classList.toggle("loading", loading);
    btn.querySelector(".btn-text").textContent = loading ? "Enviando..." : "Enviar correo";
  }

  function isConfigured() {
    return typeof EMAILJS_CONFIG !== "undefined" &&
      Object.values(EMAILJS_CONFIG).every(v => v && !v.startsWith("TU_"));
  }

  Object.keys(fields).forEach(name => {
    fields[name].addEventListener("blur", () => validateField(name));
    fields[name].addEventListener("input", () => {
      if (fields[name].classList.contains("invalid")) validateField(name);
    });
  });

  fields.mensaje.addEventListener("input", () => {
    contador.textContent = fields.mensaje.value.length;
  });

  if (isConfigured()) {
    emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("⚠ Revisa los campos marcados en rojo.", "error");
      return;
    }
    if (!isConfigured()) {
      showToast("✖ EmailJS no está configurado. Edita js/config.js.", "error");
      return;
    }

    const params = {
      to_name: fields.nombre.value.trim(),
      to_email: fields.correo.value.trim(),
      subject: fields.asunto.value.trim(),
      message: fields.mensaje.value.trim(),
      fecha: new Date().toLocaleString("es-PE")
    };

    setLoading(true);
    try {
      await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, params);
      showToast(`✔ Correo enviado correctamente a ${params.to_email}`, "success");
      form.reset();
      contador.textContent = "0";
      Object.values(fields).forEach(f => f.classList.remove("valid", "invalid"));
    } catch (err) {
      console.error("Error EmailJS:", err);
      const detalle = err && (err.text || err.message) ? `: ${err.text || err.message}` : "";
      showToast(`✖ No se pudo enviar el correo${detalle}`, "error");
    } finally {
      setLoading(false);
    }
  });
})();
