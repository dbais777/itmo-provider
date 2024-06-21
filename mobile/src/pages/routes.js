import MainView from './MainView/MainView.vue'
import AdminView from './AdminView/AdminView.vue'
import { SettingView } from './SettingView'
import { TeachersView } from './TeachersView'
import { PersonView } from './PersonView'

export const routes = [
  {
    path: '/settings',
    name: 'settings',
    component: SettingView
  },
  {
    path: '/teachers',
    name: 'teachers',
    component: TeachersView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: async () => (await import('./AdminView')).AdminView,
  },
  {
    path: '/teachers/:id',
    name: 'person',
    component: PersonView
  },
  {
    path: '/',
    name: 'home',
    component: MainView
  },

]