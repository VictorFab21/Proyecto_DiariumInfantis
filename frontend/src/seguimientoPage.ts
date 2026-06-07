type User = {
  id_usuario?: number;
  nombre_usuario?: string;
  correo?: string;
};

type PregnancyRecord = {
  id_embarazo: number;
  ultima_menstruacion: string;
  id_usuariofk?: number;
};

type SeguimientoData = {
  id_embarazo: number;
  analisisClinicos?: Array<{ id_analisis: number; tipo_analisis: string; fecha: string; resultado: string }>;
  ultrasonidos?: Array<{ id_ultrasonido: number; fecha: string; semanas_estimadas: number; observaciones: string }>;
  controlPrenatal?: Array<{ id_control: number; presion_arterial?: string; peso?: string; fecha_control: string }>;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

async function fetchPregnancy(userId: number, token: string): Promise<PregnancyRecord | null> {
  const response = await fetch(`http://localhost:3000/api/embarazos/usuario/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) return null;
  const data = await response.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

async function fetchSeguimiento(id_embarazo: number, token: string): Promise<SeguimientoData | null> {
  const response = await fetch(`http://localhost:3000/api/seguimiento-embarazo?id_embarazo=${id_embarazo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;
  const data = await response.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

async function postSeguimiento(path: string, payload: object, token: string) {
  const response = await fetch(`http://localhost:3000/api/seguimiento-embarazo/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.mensaje || result.message || 'Error al guardar el registro');
  }

  return result;
}

export async function renderSeguimientoPage(
  user: User,
  goBack: () => void,
  onLogout: () => void,
) {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  const token = localStorage.getItem('diariumToken') || '';
  const userId = user.id_usuario;

  app.innerHTML = `
    <main class="seguimiento-page">
      <section class="topbar">
        <div class="topbar-brand">
          <span class="brand-title">Diarium Infantis</span>
          <span class="brand-tag">Seguimiento de embarazo</span>
        </div>
        <div class="topbar-actions">
          <button id="back-home" class="secondary-button">Volver</button>
          <button id="logout-button" class="secondary-button">Cerrar sesión</button>
        </div>
      </section>

      <section class="seguimiento-grid">
        <article class="seguimiento-panel">
          <h2>Mi embarazo</h2>
          <div id="pregnancy-info" class="seguimiento-empty">Cargando embarazo...</div>
        </article>

        <article class="seguimiento-panel seguimiento-records">
          <h2>Registros de seguimiento</h2>
          <div id="seguimiento-content" class="seguimiento-content">Cargando registros...</div>
        </article>
      </section>

      <section class="seguimiento-forms">
        <article class="seguimiento-panel">
          <h3>Agregar análisis clínico</h3>
          <form id="analisis-form" class="seguimiento-form">
            <label><span>Tipo de análisis</span><input type="text" name="tipo_analisis" required /></label>
            <label><span>Fecha</span><input type="date" name="fecha" required /></label>
            <label><span>Resultado</span><input type="text" name="resultado" required /></label>
            <button type="submit" class="primary-button">Guardar análisis</button>
          </form>
        </article>
        <br>

        <article class="seguimiento-panel">
          <h3>Agregar ultrasonido</h3>
          <form id="ultrasonido-form" class="seguimiento-form">
            <label><span>Fecha</span><input type="date" name="fecha" required /></label>
            <label><span>Semanas estimadas</span><input type="number" name="semanas_estimadas" required /></label>
            <label><span>Observaciones</span><input type="text" name="observaciones" /></label>
            <button type="submit" class="primary-button">Guardar ultrasonido</button>
          </form>
        </article>

         <br>
        <article class="seguimiento-panel">
          <h3>Agregar control prenatal</h3>
          <form id="control-form" class="seguimiento-form">
            <label><span>Fecha</span><input type="date" name="fecha_control" required /></label>
            <label><span>Presión arterial</span><input type="text" name="presion_arterial" /></label>
            <label><span>Peso</span><input type="text" name="peso" /></label>
            <button type="submit" class="primary-button">Guardar control</button>
          </form>
        </article>
      </section>

      <div id="seguimiento-message" class="message"></div>
    </main>
  `;

  const backButton = document.querySelector<HTMLButtonElement>('#back-home');
  const logoutButton = document.querySelector<HTMLButtonElement>('#logout-button');
  const pregnancyInfo = document.querySelector<HTMLDivElement>('#pregnancy-info');
  const seguimientoContent = document.querySelector<HTMLDivElement>('#seguimiento-content');
  const message = document.querySelector<HTMLDivElement>('#seguimiento-message');
  const analisisForm = document.querySelector<HTMLFormElement>('#analisis-form');
  const ultrasonidoForm = document.querySelector<HTMLFormElement>('#ultrasonido-form');
  const controlForm = document.querySelector<HTMLFormElement>('#control-form');

  backButton?.addEventListener('click', goBack);
  logoutButton?.addEventListener('click', onLogout);

  if (!token || !userId) {
    if (pregnancyInfo) pregnancyInfo.textContent = 'No hay usuario autenticado.';
    if (seguimientoContent) seguimientoContent.textContent = 'Inicia sesión para ver los registros.';
    return;
  }

  async function refreshSeguimiento(id_embarazo: number) {
    if (!seguimientoContent || !pregnancyInfo) return;

    const seguimiento = await fetchSeguimiento(id_embarazo, token);
    if (!seguimiento) {
      seguimientoContent.innerHTML = '<div class="seguimiento-empty">Aún no hay registros de seguimiento.</div>';
      return;
    }

    const analisisHtml = seguimiento.analisisClinicos && seguimiento.analisisClinicos.length > 0
      ? seguimiento.analisisClinicos
          .map((item) => `<li><strong>${formatDate(item.fecha)}:</strong> ${item.tipo_analisis} — ${item.resultado}</li>`)
          .join('')
      : '<li>No hay análisis clínicos.</li>';

    const ultrasonidosHtml = seguimiento.ultrasonidos && seguimiento.ultrasonidos.length > 0
      ? seguimiento.ultrasonidos
          .map((item) => `<li><strong>${formatDate(item.fecha)}:</strong> ${item.semanas_estimadas} semanas — ${item.observaciones}</li>`)
          .join('')
      : '<li>No hay ultrasonidos.</li>';

    const controlesHtml = seguimiento.controlPrenatal && seguimiento.controlPrenatal.length > 0
      ? seguimiento.controlPrenatal
          .map((item) => `<li><strong>${formatDate(item.fecha_control)}:</strong> ${item.presion_arterial || 'N/A'} — ${item.peso || 'N/A'}</li>`)
          .join('')
      : '<li>No hay controles prenatales.</li>';

    seguimientoContent.innerHTML = `
      <div class="seguimiento-record-section">
        <h4>Análisis clínicos</h4>
        <ul>${analisisHtml}</ul>
      </div>
      <div class="seguimiento-record-section">
        <h4>Ultrasonidos</h4>
        <ul>${ultrasonidosHtml}</ul>
      </div>
      <div class="seguimiento-record-section">
        <h4>Controles prenatales</h4>
        <ul>${controlesHtml}</ul>
      </div>
    `;
  }

  const pregnancy = await fetchPregnancy(userId, token);
  if (!pregnancy) {
    if (pregnancyInfo) pregnancyInfo.textContent = 'No hay un embarazo asociado al usuario.';
    if (seguimientoContent) seguimientoContent.textContent = 'Registra un embarazo primero para comenzar el seguimiento.';
    return;
  }

  const pregnancyId = pregnancy.id_embarazo;

  if (pregnancyInfo) {
    pregnancyInfo.innerHTML = `
      <p><strong>ID de embarazo:</strong> ${pregnancy.id_embarazo}</p>
      <p><strong>Última menstruación:</strong> ${formatDate(pregnancy.ultima_menstruacion)}</p>
    `;
  }

  await refreshSeguimiento(pregnancy.id_embarazo);


  if (analisisForm) {
    analisisForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!message) return;
      const data = new FormData(analisisForm);
      const payload = {
        id_embarazo: pregnancyId,
        tipo_analisis: data.get('tipo_analisis')?.toString(),
        fecha: data.get('fecha')?.toString(),
        resultado: data.get('resultado')?.toString(),
      };
      await handleSubmit('analisis', payload, analisisForm);
    });
  }

  if (ultrasonidoForm) {
    ultrasonidoForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!message) return;
      const data = new FormData(ultrasonidoForm);
      const payload = {
        id_embarazo: pregnancyId,
        fecha: data.get('fecha')?.toString(),
        semanas_estimadas: Number(data.get('semanas_estimadas')),
        observaciones: data.get('observaciones')?.toString(),
      };
      await handleSubmit('ultrasonido', payload, ultrasonidoForm);
    });
  }

  if (controlForm) {
    controlForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!message) return;
      const data = new FormData(controlForm);
      const payload = {
        id_embarazo: pregnancyId,
        fecha_control: data.get('fecha_control')?.toString(),
        presion_arterial: data.get('presion_arterial')?.toString(),
        peso: data.get('peso')?.toString(),
      };
      await handleSubmit('controlPrenatal', payload, controlForm);
    });
  }

  async function handleSubmit(endpoint: string, payload: object, form: HTMLFormElement) {
    if (!message) return;
    message.textContent = '';
    message.className = 'message';

    try {
      await postSeguimiento(endpoint, payload, token);
      form.reset();
      message.textContent = 'Registro guardado correctamente';
      message.className = 'message message-success';
      await refreshSeguimiento(pregnancyId);
    } catch (error) {
      message.textContent = error instanceof Error ? error.message : 'Error al guardar el registro';
      message.className = 'message message-error';
    }
  }
}
