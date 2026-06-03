import './style.css'
import { renderLandingPage } from './landingPage'
import { renderLoginForm } from './loginForm'
import { renderUserForm } from './userForm'
import { renderHomePage } from './homePage'
import { renderCalendarPage } from './calendarPage'
import { renderSeguimientoPage } from './seguimientoPage'

type User = {
  id_usuario?: number;
  nombre_usuario?: string;
  correo?: string;
}

function goToLanding() {
  renderLandingPage(goToRegister, goToLogin)
}

function goToRegister() {
  renderUserForm(goToLogin, () => {
    renderLoginForm(goToRegister, goToHome)
  })
}

function goToLogin() {
  renderLoginForm(goToRegister, goToHome)
}

function goToLogout() {
  localStorage.removeItem('diariumToken')
  localStorage.removeItem('diariumUser')
  goToLanding()
}

function goToHome(user: User) {
  renderHomePage(user, goToLogout, goToCalendar, goToSeguimiento)
}

function goToCalendar(user: User) {
  renderCalendarPage(user, () => goToHome(user), goToLogout)
}

function goToSeguimiento(user: User) {
  renderSeguimientoPage(user, () => goToHome(user), goToLogout)
}

const storedUser = localStorage.getItem('diariumUser')
if (storedUser) {
  try {
    const user = JSON.parse(storedUser)
    goToHome(user)
  } catch {
    goToLanding()
  }
} else {
  goToLanding()
}
