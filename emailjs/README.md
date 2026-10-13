# Envío de correos con EmailJS

Aplicación web (HTML5, CSS3 y JavaScript) que permite ingresar datos en un formulario, validarlos y enviar un mensaje de confirmación/notificación al correo personal o institucional del estudiante mediante [EmailJS](https://www.emailjs.com/).

## Funcionalidades
- Formulario con nombre, correo, asunto y mensaje.
- Validación en el cliente (campos obligatorios, longitud mínima, formato de correo, solo letras en el nombre).
- Envío del correo con `emailjs.send()` usando los parámetros de la plantilla.
- Notificación visual (toast) de éxito o error y estado de carga en el botón.

## Configuración de EmailJS
1. Crear una cuenta en https://dashboard.emailjs.com.
2. **Email Services** → *Add New Service* (p. ej. Gmail) → copiar el **Service ID**.
3. **Email Templates** → *Create New Template* con los siguientes parámetros:
   - **To Email:** `{{to_email}}`
   - **Subject:** `{{subject}}`
   - **Content:**
     ```
     Hola {{to_name}},

     Se ha recibido tu solicitud correctamente.

     Mensaje: {{message}}
     Fecha: {{fecha}}
     ```
   Copiar el **Template ID**.
4. **Account** → **General** → copiar la **Public Key**.
5. Colocar los valores en `js/config.js`:
   ```js
   const EMAILJS_CONFIG = {
     PUBLIC_KEY: "...",
     SERVICE_ID: "...",
     TEMPLATE_ID: "..."
   };
   ```

## Parámetros enviados a la plantilla
| Parámetro   | Descripción                          |
|-------------|--------------------------------------|
| `to_name`   | Nombre ingresado por el usuario      |
| `to_email`  | Correo destino (personal/institucional) |
| `subject`   | Asunto del mensaje                   |
| `message`   | Contenido del mensaje                |
| `fecha`     | Fecha y hora del envío               |

## Ejecución
Abrir `index.html` en el navegador o usar un servidor local (por ejemplo, la extensión *Live Server* de VS Code o `python3 -m http.server`).

## Seguridad
La Public Key es visible en el navegador, por lo que cualquiera podría usar el formulario para enviar correos. Para evitar abusos, en el dashboard de EmailJS (**Account → Security**):
- Activar **Allowed origins / domains** y agregar solo el dominio donde se publica la app.
- Configurar **Rate limits** (p. ej. 1 solicitud cada 10 segundos).
- Opcionalmente activar **CAPTCHA** en la plantilla.
