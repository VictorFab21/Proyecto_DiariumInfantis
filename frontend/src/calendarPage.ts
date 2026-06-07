type User = {
  id_usuario?: number;
  nombre_usuario?: string;
  correo?: string;
};

type Appointment = {
  id_cita: number;
  fecha_cita: string;
  motivo: string;
  advertencia?: string;
  nombre_doctor?: string;
  fecha_proxCita?: string;
  id_usuariofk?: number;
};

async function fetchAppointments(token: string): Promise<Appointment[]> {
  const response = await fetch('http://localhost:3000/api/citas', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('No se pudieron cargar las citas');
  }
  return response.json();
}

async function createAppointment(data: Partial<Appointment>, token: string) {
  const response = await fetch('http://localhost:3000/api/citas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.mensaje || result.message || 'Error al registrar la cita');
  }

  return result.data;
}

function renderAppointmentCalendar(appointments: Appointment[], currentMonth: number, currentYear: number) {
  // Función para obtener el número de días en un mes
  function getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  // Función para obtener el día de la semana del primer día del mes
  function getFirstDayOfMonth(month: number, year: number) {
    return new Date(year, month, 1).getDay();
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  // Crear el calendario
  let calendarHTML = `
    <div class="calendar-header">
      <button id="prev-month" class="calendar-nav-button">&lt;</button>
      <h3>${new Date(currentYear, currentMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h3>
      <button id="next-month" class="calendar-nav-button">&gt;</button>
    </div>
    <div class="calendar-grid">
      <div class="calendar-day-header">Dom</div>
      <div class="calendar-day-header">Lun</div>
      <div class="calendar-day-header">Mar</div>
      <div class="calendar-day-header">Mié</div>
      <div class="calendar-day-header">Jue</div>
      <div class="calendar-day-header">Vie</div>
      <div class="calendar-day-header">Sáb</div>
  `;

  // Espacios vacíos antes del primer día
  for (let i = 0; i < firstDay; i++) {
    calendarHTML += '<div class="calendar-day empty"></div>';
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayAppointments = appointments.filter(app => app.fecha_cita.startsWith(dateStr));

    let dayClass = 'calendar-day';
    const today = new Date();
    if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
      dayClass += ' today';
    }

    calendarHTML += `<div class="${dayClass}">`;
    calendarHTML += `<div class="day-number">${day}</div>`;

    if (dayAppointments.length > 0) {
      calendarHTML += '<div class="appointments">';
      dayAppointments.forEach(app => {
        calendarHTML += `<div class="appointment-item" title="${app.motivo} - ${app.nombre_doctor || 'Sin doctor'}">${app.motivo}</div>`;
      });
      calendarHTML += '</div>';
    }

    calendarHTML += '</div>';
  }

  calendarHTML += '</div></div>';

  return calendarHTML;
}

export async function renderCalendarPage(
  user: User,
  goBack: () => void,
  onLogout: () => void,
) {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  const token = localStorage.getItem('diariumToken');
  const userId = user.id_usuario;

  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  let appointments: Appointment[] = [];

  async function loadAppointments() {
    if (!token || !userId) return [];
    try {
      const allAppointments = await fetchAppointments(token);
      return allAppointments.filter((cita) => cita.id_usuariofk === userId);
    } catch (error) {
      console.error('Error loading appointments:', error);
      return [];
    }
  }

  function renderCalendar() {
    app!.innerHTML = `
      <main class="calendar-page">
        <section class="topbar">
          <div class="topbar-brand">
            <span class="brand-title">Diarium Infantis</span>
            <span class="brand-tag">Calendario de citas</span>
          </div>
          <div class="topbar-actions">
            <button id="back-home" class="secondary-button">Volver</button>
            <button id="logout-button" class="secondary-button">Cerrar sesión</button>
          </div>
        </section>

        <section class="calendar-grid-section">
          <article class="calendar-panel">
            <h2>Registrar nueva cita</h2>
            <form id="calendar-form" class="calendar-form">
              <label><span>Fecha de cita</span><input type="date" name="fecha_cita" required /></label>
              <label><span>Motivo</span><input type="text" name="motivo" placeholder="Motivo de la cita" required /></label>
              <label><span>Doctor</span><input type="text" name="nombre_doctor" placeholder="Nombre del doctor" /></label>
              <label><span>Próxima cita</span><input type="date" name="fecha_proxCita" /></label>
              <label><span>Advertencia</span><input type="text" name="advertencia" placeholder="Notas adicionales" /></label>
              <button type="submit" class="primary-button">Guardar cita</button>
              <div id="calendar-message" class="message"></div>
            </form>
          </article>

          <article class="calendar-panel">
            <h2>Mis citas programadas</h2>
            <div id="calendar-container" class="calendar-container">${renderAppointmentCalendar(appointments, currentMonth, currentYear)}</div>
          </article>
        </section>
      </main>
    `;

    // Re-attach event listeners
    const backButton = document.querySelector<HTMLButtonElement>('#back-home');
    const logoutButton = document.querySelector<HTMLButtonElement>('#logout-button');
    const form = document.querySelector<HTMLFormElement>('#calendar-form');
    const message = document.querySelector<HTMLDivElement>('#calendar-message');
    const prevButton = document.querySelector<HTMLButtonElement>('#prev-month');
    const nextButton = document.querySelector<HTMLButtonElement>('#next-month');

    backButton?.addEventListener('click', goBack);
    logoutButton?.addEventListener('click', onLogout);

    prevButton?.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    });

    nextButton?.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    });

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form || !message || !token || !userId) return;

      const data = new FormData(form);
      const payload = {
        fecha_cita: data.get('fecha_cita')?.toString(),
        motivo: data.get('motivo')?.toString(),
        nombre_doctor: data.get('nombre_doctor')?.toString(),
        fecha_proxCita: data.get('fecha_proxCita')?.toString(),
        advertencia: data.get('advertencia')?.toString(),
        id_usuariofk: userId,
      };

      message.textContent = '';
      message.className = 'message';

      try {
        await createAppointment(payload, token);
        form.reset();
        message.textContent = 'Cita registrada correctamente';
        message.className = 'message message-success';
        appointments = await loadAppointments();
        renderCalendar();
      } catch (error) {
        message.textContent = error instanceof Error ? error.message : 'No se pudo guardar la cita';
        message.className = 'message message-error';
      }
    });
  }

  appointments = await loadAppointments();
  renderCalendar();
}
