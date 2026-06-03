import logoImg from './assets/logo.png'

export function renderLandingPage(onRegister: () => void, onLogin: () => void) {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = `
    <main class="user-form-page">
      <section class="form-card">
        <div class="brand-header">
          <img src="${logoImg}" alt="Diarium Infantis" class="brand-logo" />
          <div>
            <p class="brand-title">Diarium Infantis</p>
            <h1>Bienvenido</h1>
          </div>
        </div>
        <p class="welcome-text">Selecciona una opción para comenzar.</p>
        <div class="landing-actions">
          <button id="register-action" class="primary-button">Crear una cuenta</button>
          <button id="login-action" class="secondary-button">Iniciar sesión</button>
        </div>
      </section>
    </main>
  `;

  const registerButton = document.querySelector<HTMLButtonElement>('#register-action');
  const loginButton = document.querySelector<HTMLButtonElement>('#login-action');

  registerButton?.addEventListener('click', onRegister);
  loginButton?.addEventListener('click', onLogin);
}
