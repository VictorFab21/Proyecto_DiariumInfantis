import logoImg from './assets/logo.png'

export function renderUserForm(onLogin: () => void, onRegisterSuccess: () => void) {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = `
    <main class="user-form-page">
      <section class="form-card">
        <div class="brand-header">
          <img src="${logoImg}" alt="Diarium Infantis" class="brand-logo" />
          <div>
            <p class="brand-title">Diarium Infantis</p>
            <h1>Registro</h1>
          </div>
        </div>
        <form id="create-user-form" class="user-form">
          <div class="form-grid">
            <label>
              <span>Nombre(s)</span>
              <input type="text" name="nombre" required placeholder="Escribe tu nombre" />
            </label>
            <label>
              <span>Apellidos</span>
              <input type="text" name="apellido" required placeholder="Escribe tus apellidos" />
            </label>
            <label>
              <span>Correo electrónico</span>
              <input type="email" name="correo" required placeholder="Ingresa tu correo" />
            </label>
            <label>
              <span>Contraseña</span>
              <input type="password" name="contrasenia" required placeholder="Contraseña" />
            </label>
            <label>
              <span>Teléfono <small>(opcional)</small></span>
              <input type="tel" name="telefono" placeholder="10 dígitos" />
            </label>
          </div>
          <div class="form-actions">
            <button type="submit" class="primary-button">Crear usuario</button>
          </div>
          <div class="message" aria-live="polite"></div>
        </form>
        <div class="footer-link">
          <span>¿Ya tienes cuenta?</span>
          <button id="go-login" class="link-button" type="button">Iniciar sesión</button>
        </div>
      </section>
    </main>
  `;

  const form = document.querySelector<HTMLFormElement>('#create-user-form');
  const message = document.querySelector<HTMLDivElement>('.message');
  const goLogin = document.querySelector<HTMLButtonElement>('#go-login');

  goLogin?.addEventListener('click', onLogin);

  if (!form || !message) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';
    message.className = 'message';

    const formData = new FormData(form);
    const data = {
      nombre: formData.get('nombre')?.toString().trim(),
      apellido: formData.get('apellido')?.toString().trim(),
      correo: formData.get('correo')?.toString().trim(),
      contrasenia: formData.get('contrasenia')?.toString(),
      telefono: formData.get('telefono')?.toString().trim(),
    };

    const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch('http://localhost:3000/api/usuario/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        const errorMessage = result?.mensaje || response.statusText || 'Error al crear el usuario';
        throw new Error(errorMessage);
      }

      message.textContent = 'Usuario creado correctamente.';
      message.classList.add('message-success');
      form.reset();
      setTimeout(onRegisterSuccess, 900);
    } catch (error) {
      message.textContent = error instanceof Error ? error.message : 'Error al crear el usuario.';
      message.classList.add('message-error');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
