import logoImg from './assets/logo.png'

export function renderLoginForm(onRegister: () => void, onLoginSuccess: (user: { nombre_usuario?: string; correo?: string }) => void) {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = `
    <main class="user-form-page">
      <section class="form-card">
        <div class="brand-header">
          <img src="${logoImg}" alt="Diarium Infantis" class="brand-logo" />
          <div>
            <p class="brand-title">Diarium Infantis</p>
            <h1>Iniciar sesión</h1>
          </div>
        </div>
        <form id="login-form" class="user-form">
          <div class="form-grid">
            <label>
              <span>Correo electrónico</span>
              <input type="email" name="correo" required placeholder="Ingresa tu correo" />
            </label>
            <label>
              <span>Contraseña</span>
              <input type="password" name="contrasenia" required placeholder="Contraseña" />
            </label>
          </div>
          <div class="form-actions login-actions">
            <button type="submit" class="primary-button">Ingresar</button>
          </div>
          <div class="message" aria-live="polite"></div>
        </form>
        <div class="footer-link">
          <span>¿No tienes cuenta?</span>
          <button id="go-register" class="link-button" type="button">Regístrate</button>
        </div>
      </section>
    </main>
  `;

  const form = document.querySelector<HTMLFormElement>('#login-form');
  const message = document.querySelector<HTMLDivElement>('.message');
  const goRegister = document.querySelector<HTMLButtonElement>('#go-register');

  goRegister?.addEventListener('click', onRegister);

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form || !message) return;

    message.textContent = '';
    message.className = 'message';

    const formData = new FormData(form);
    const correo = formData.get('correo')?.toString().trim();
    const contrasenia = formData.get('contrasenia')?.toString();

    const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contrasenia }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al iniciar sesión');
      }

      localStorage.setItem('diariumToken', result.token);
      localStorage.setItem('diariumUser', JSON.stringify(result.usuario));
      message.textContent = 'Inicio de sesión exitoso';
      message.classList.add('message-success');
      onLoginSuccess(result.usuario);
    } catch (error) {
      message.textContent = error instanceof Error ? error.message : 'Error al iniciar sesión';
      message.classList.add('message-error');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
