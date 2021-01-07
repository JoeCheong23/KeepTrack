import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';
import Toolbar from 'primevue/toolbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';

import 'primevue/resources/themes/md-light-indigo/theme.css' //Material Design Indigo Light theme
import 'primevue/resources/primevue.min.css' //core CSS
import 'primeicons/primeicons.css' //Icons
import 'primeflex/primeflex.css' //Primeflex design helpers and templates.

const app = createApp(App);
app.use(PrimeVue);
app.component('Button', Button); //add buttons to available PrimeVue components for this 
app.component('Card', Card);
app.component('Menubar', Menubar);
app.component('InputText', InputText);
app.component('Toolbar', Toolbar);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Dialog', Dialog);
app.component('InputNumber', InputNumber);
app.component('Textarea', Textarea);


app.mount('#app');
