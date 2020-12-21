import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';

import 'primevue/resources/themes/md-light-indigo/theme.css' //Material Design Indigo Light theme
import 'primevue/resources/primevue.min.css' //core CSS
import 'primeicons/primeicons.css' //Icons

const app = createApp(App);
app.use(PrimeVue);
app.component('Button', Button) //add buttons to available PrimeVue components for this 


app.mount('#app');
