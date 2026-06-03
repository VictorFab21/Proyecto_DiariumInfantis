type User = {
  id_usuario?: number;
  nombre_usuario?: string;
  correo?: string;
};

type PregnancyStage = {
  label: string;
  description: string;
  length: string;
  weight: string;
};

type PregnancyRecord = {
  id_embarazo: number;
  ultima_menstruacion: string;
  semana_gestacion?: number;
  fecha_probable?: string;
  id_usuariofk?: number;
};

const stages: PregnancyStage[] = [
  { label: '0-4 semanas', description: 'Fase de gestación temprana', length: '0.6 cm', weight: '0.1 g' },
  { label: '5-8 semanas', description: 'Embrión en desarrollo', length: '2.5 cm', weight: '2 g' },
  { label: '9-12 semanas', description: 'Feto en crecimiento', length: '6.0 cm', weight: '14 g' },
  { label: '13-16 semanas', description: 'Primer trimestre avanzado', length: '10.0 cm', weight: '70 g' },
  { label: '17-20 semanas', description: 'Movimiento activo', length: '16.0 cm', weight: '250 g' },
  { label: '21-24 semanas', description: 'Desarrollo sensorial', length: '25.0 cm', weight: '500 g' },
  { label: '25-28 semanas', description: 'Crecimiento rápido', length: '30.0 cm', weight: '760 g' },
  { label: '29-32 semanas', description: 'Tamaño mayor', length: '40.0 cm', weight: '1700 g' },
  { label: '33-36 semanas', description: 'Casi término', length: '43.0 cm', weight: '2500 g' },
  { label: '37-40 semanas', description: 'A término', length: '50.0 cm', weight: '3200 g' },
];

function getGestationData(startDate: Date) {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentWeek = Math.max(0, Math.min(42, Math.floor(diffDays / 7)));
  const trimester = currentWeek <= 13 ? '1er trimestre' : currentWeek <= 27 ? '2º trimestre' : '3er trimestre';
  const progress = Math.round(Math.max(0, Math.min(100, (currentWeek / 40) * 100)));
  const stageIndex = Math.min(stages.length - 1, Math.floor(currentWeek / 4));
  const stage = stages[stageIndex];
  const remainingWeeks = currentWeek >= 40 ? 0 : 40 - currentWeek;

  return {
    now,
    diffDays,
    currentWeek,
    trimester,
    progress,
    stage,
    remainingWeeks,
  };
}

function formatDate(date: Date) {
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

async function fetchPregnancyFromDB(userId: number, token: string): Promise<PregnancyRecord | null> {
  try {
    const response = await fetch(`http://localhost:3000/api/embarazo/usuario/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    if (!Array.isArray(result) || result.length === 0) {
      return null;
    }

    return result[0] as PregnancyRecord;
  } catch {
    return null;
  }
}

function parsePregnancyDate(record: PregnancyRecord | null): Date | null {
  if (!record?.ultima_menstruacion) return null;
  const date = new Date(record.ultima_menstruacion);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function renderHomePage(
  user: User,
  onLogout: () => void,
  onOpenCalendar: (user: User) => void,
  onOpenSeguimiento: (user: User) => void,
) {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = `
    <main class="home-page">
      <section class="topbar">
        <div class="topbar-brand">
          <span class="brand-title">Diarium Infantis</span>
          <span class="brand-tag">Inicio</span>
        </div>
        <div class="topbar-actions">
          <button id="open-calendar" class="secondary-button">Calendario</button>
          <button id="open-seguimiento" class="secondary-button">Seguimiento</button>
          <button id="logout-button" class="secondary-button">Cerrar sesión</button>
        </div>
      </section>

      <section class="home-grid">
        <article class="gestation-card">
          <div class="card-header">
            <h2>Estado gestativo</h2>
            <span id="pregnancy-start-date">Cargando...</span>
          </div>

          <div class="gestation-body">
            <div class="gestation-chart">
              <div class="gestation-ring">
                <div id="gestation-week" class="gestation-value">--</div>
                <div class="gestation-label">semanas</div>
              </div>

              <div class="progress-bar-wrapper">
                <div class="progress-bar">
                  <div id="progress-fill" class="progress-fill" style="width: 0%"></div>
                </div>
                <div class="progress-meta">
                  <span id="progress-text">0% del embarazo</span>
                  <span id="trimester-text">Fecha pendiente</span>
                </div>
              </div>
            </div>

            <div class="gestation-summary">
              <div id="stage-label" class="summary-chip">Cargando</div>
              <p id="stage-description">Buscando información de embarazo en la base de datos.</p>
              <div class="summary-details">
                <div>
                  <span>Tamaño aprox.</span>
                  <strong id="stage-length">--</strong>
                </div>
                <div>
                  <span>Peso aprox.</span>
                  <strong id="stage-weight">--</strong>
                </div>
                <div>
                  <span>Semanas restantes</span>
                  <strong id="remaining-weeks">--</strong>
                </div>
              </div>
            </div>
          </div>
        </article>

        <aside class="detail-card">
          <div class="detail-header">
            <h3>Resumen de la etapa</h3>
          </div>
          <div class="detail-content">
            <p id="summary-paragraph">Cargando datos de embarazo...</p>
            <div id="pregnancy-registration" class="pregnancy-registration">
              <label>
                Fecha de última menstruación
                <input id="pregnancy-start-input" type="date" />
              </label>
              <button id="register-pregnancy" class="primary-button">Registrar embarazo</button>
              <div id="register-message" class="message"></div>
            </div>
           
          </div>
        </aside>
      </section>
    </main>
  `;

  const logoutButton = document.querySelector<HTMLButtonElement>('#logout-button');
  const logoutButtonAlt = document.querySelector<HTMLButtonElement>('#logout-button-alt');
  const openCalendarButton = document.querySelector<HTMLButtonElement>('#open-calendar');
  const openSeguimientoButton = document.querySelector<HTMLButtonElement>('#open-seguimiento');
  const registerSection = document.querySelector<HTMLDivElement>('#pregnancy-registration');
  const registerButton = document.querySelector<HTMLButtonElement>('#register-pregnancy');
  const pregnancyStartInput = document.querySelector<HTMLInputElement>('#pregnancy-start-input');
  const registerMessage = document.querySelector<HTMLDivElement>('#register-message');

  logoutButton?.addEventListener('click', onLogout);
  logoutButtonAlt?.addEventListener('click', onLogout);
  openCalendarButton?.addEventListener('click', () => onOpenCalendar(user));
  openSeguimientoButton?.addEventListener('click', () => onOpenSeguimiento(user));

  const userId = user.id_usuario;
  const token = localStorage.getItem('diariumToken');

  if (!userId || !token) {
    const startDateElement = document.querySelector<HTMLSpanElement>('#pregnancy-start-date');
    const progressText = document.querySelector<HTMLSpanElement>('#progress-text');
    const trimesterText = document.querySelector<HTMLSpanElement>('#trimester-text');
    const stageLabel = document.querySelector<HTMLDivElement>('#stage-label');
    const stageDescription = document.querySelector<HTMLParagraphElement>('#stage-description');
    const stageLength = document.querySelector<HTMLElement>('#stage-length');
    const stageWeight = document.querySelector<HTMLElement>('#stage-weight');
    const remainingWeeks = document.querySelector<HTMLElement>('#remaining-weeks');
    const summaryParagraph = document.querySelector<HTMLParagraphElement>('#summary-paragraph');

    if (startDateElement) startDateElement.textContent = 'No hay autorización';
    if (progressText) progressText.textContent = '0% del embarazo';
    if (trimesterText) trimesterText.textContent = 'Sin datos';
    if (stageLabel) stageLabel.textContent = 'Sin datos';
    if (stageDescription) stageDescription.textContent = 'No se pudo acceder a la fecha de embarazo desde la base de datos.';
    if (stageLength) stageLength.textContent = '--';
    if (stageWeight) stageWeight.textContent = '--';
    if (remainingWeeks) remainingWeeks.textContent = '--';
    if (summaryParagraph) summaryParagraph.textContent = 'Inicia sesión nuevamente para recuperar los datos de embarazo desde la base de datos.';
    return;
  }

  const pregnancyRecord = await fetchPregnancyFromDB(userId, token);
  const pregnancyStart = parsePregnancyDate(pregnancyRecord);
  const gestation = pregnancyStart ? getGestationData(pregnancyStart) : null;

  const startDateElement = document.querySelector<HTMLSpanElement>('#pregnancy-start-date');
  const weekElement = document.querySelector<HTMLDivElement>('#gestation-week');
  const progressFill = document.querySelector<HTMLDivElement>('#progress-fill');
  const progressText = document.querySelector<HTMLSpanElement>('#progress-text');
  const trimesterText = document.querySelector<HTMLSpanElement>('#trimester-text');
  const stageLabel = document.querySelector<HTMLDivElement>('#stage-label');
  const stageDescription = document.querySelector<HTMLParagraphElement>('#stage-description');
  const stageLength = document.querySelector<HTMLElement>('#stage-length');
  const stageWeight = document.querySelector<HTMLElement>('#stage-weight');
  const remainingWeeks = document.querySelector<HTMLElement>('#remaining-weeks');
  const summaryParagraph = document.querySelector<HTMLParagraphElement>('#summary-paragraph');

  if (gestation) {
    if (startDateElement) startDateElement.textContent = formatDate(pregnancyStart!);
    if (weekElement) weekElement.textContent = `${gestation.currentWeek}`;
    if (progressFill) progressFill.style.width = `${gestation.progress}%`;
    if (progressText) progressText.textContent = `${gestation.progress}% del embarazo`;
    if (trimesterText) trimesterText.textContent = gestation.trimester;
    if (stageLabel) stageLabel.textContent = gestation.stage.label;
    if (stageDescription) stageDescription.textContent = gestation.stage.description;
    if (stageLength) stageLength.textContent = gestation.stage.length;
    if (stageWeight) stageWeight.textContent = gestation.stage.weight;
    if (remainingWeeks) remainingWeeks.textContent = `${gestation.remainingWeeks}`;
    if (summaryParagraph) summaryParagraph.textContent = `Tu embarazo va por la semana ${gestation.currentWeek} y se encuentra en ${gestation.trimester}. Esta información se actualiza con la fecha real de hoy (${formatDate(new Date())}).`;
    if (registerSection) registerSection.style.display = 'none';
  } else {
    if (startDateElement) startDateElement.textContent = 'No registrado';
    if (stageLabel) stageLabel.textContent = 'Sin registro';
    if (stageDescription) stageDescription.textContent = 'Este usuario no tiene un registro de embarazo en la base de datos.';
    if (summaryParagraph) summaryParagraph.textContent = 'Registra un embarazo usando el formulario para comenzar el seguimiento gestacional.';
    if (registerSection) registerSection.style.display = 'block';
  }

  if (registerButton && pregnancyStartInput && registerMessage) {
    registerButton.addEventListener('click', async () => {
      if (!pregnancyStartInput.value) {
        registerMessage.textContent = 'Selecciona una fecha para registrar el embarazo.';
        registerMessage.className = 'message message-error';
        return;
      }

      registerButton.disabled = true;
      registerMessage.textContent = '';
      registerMessage.className = 'message';

      try {
        const response = await fetch('http://localhost:3000/api/embarazo/crear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ultima_menstruacion: pregnancyStartInput.value }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.mensaje || result.message || 'Error al registrar embarazo');
        }

        renderHomePage(user, onLogout, onOpenCalendar, onOpenSeguimiento);
      } catch (error) {
        registerMessage.textContent = error instanceof Error ? error.message : 'Error al registrar embarazo';
        registerMessage.className = 'message message-error';
        registerButton.disabled = false;
      }
    });
  }
}
