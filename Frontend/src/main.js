import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuex from 'vuex'
import PrimeVue from 'primevue/config';
import connectHistory from 'connect-history-api-fallback';

import 'primevue/resources/themes/bootstrap4-light-blue/theme.css';       //theme
import 'primevue/resources/primevue.min.css';                 //core css
import 'primeicons/primeicons.css';                           //icons


import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Password from 'primevue/password';
import Divider from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import Toolbar from 'primevue/toolbar';
import RadioButton from 'primevue/radiobutton';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputNumber from 'primevue/inputnumber';
import Tag from 'primevue/tag';
import ToggleButton from 'primevue/togglebutton';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import Tooltip from 'primevue/tooltip';
import Calendar from 'primevue/calendar';
import SplitButton from 'primevue/splitbutton';
import AutoComplete from 'primevue/autocomplete';
import locale from '@/locale/locale';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import Paginator from 'primevue/paginator';
import ProgressSpinner from 'primevue/progressspinner';

import "primeflex/primeflex.css"

const app = createApp(App);
// using Options api
app.use(ToastService);
app.use(store);
app.use(router);
app.use(Vuex);
app.use(PrimeVue, locale);
app.use(connectHistory);
app.directive('tooltip', Tooltip);
app.component('Button', Button);
app.component('InputText', InputText);
app.component('Dialog', Dialog);
app.component('Password', Password);
app.component('Divider', Divider);
app.component('Checkbox', Checkbox);
app.component('Toolbar', Toolbar);
app.component('RadioButton', RadioButton);
app.component('Dropdown', Dropdown);
app.component('Textarea', Textarea);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('InputNumber', InputNumber);
app.component('Tag', Tag);
app.component('ToggleButton', ToggleButton);
app.component('Toast', Toast);
app.component('Calendar', Calendar);
app.component('SplitButton', SplitButton);
app.component('AutoComplete', AutoComplete);
app.component('Paginator', Paginator);
app.component('ProgressSpinner', ProgressSpinner);

app.component(VueQrcode.name, VueQrcode);

app.mount('#app')
