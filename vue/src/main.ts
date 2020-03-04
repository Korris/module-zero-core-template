import Vue from 'vue';
import App from './app.vue';
import iView from 'iview';
import {router} from './router/index';
import 'famfamfam-flags/dist/sprite/famfamfam-flags.css';
import './theme.less';
import Ajax from './lib/ajax';
import Util from './lib/util';
import SignalRAspNetCoreHelper from './lib/SignalRAspNetCoreHelper';
Vue.use(iView);
import store from './store/index';
Vue.config.productionTip = false;
import { appRouters,otherRouters} from './router/router';
if(!abp.utils.getCookieValue('Abp.Localization.CultureName')){
  let language=navigator.language;
  abp.utils.setCookieValue('Abp.Localization.CultureName',language,new Date(new Date().getTime() + 5 * 365 * 86400000),abp.appPath);
}

Ajax.get('/AbpUserConfiguration/GetAll').then(data=>{
  Util.abp=Util.extend(true,Util.abp,data.data.result);
  new Vue({
    render: h => h(App),
    router:router,
    store:store,
    data: {
      currentPageName: ''
    },
    async mounted () {
      this.currentPageName = this.$route.name as string;
      await this.$store.dispatch({
        type:'session/init'
      })
      if(!!this.$store.state.session.user&&this.$store.state.session.application.features['SignalR']){
        if (this.$store.state.session.application.features['SignalR.AspNetCore']) {
            SignalRAspNetCoreHelper.initSignalR();
        }
      }
      this.$store.commit('app/initCachepage');
      this.$store.commit('app/updateMenulist');
    },
    created () {
      let tagsList:Array<any> = [];
      appRouters.map((item) => {
          if (item.children.length <= 1) {
              tagsList.push(item.children[0]);
          } else {
              tagsList.push(...item.children);
          }
      });
      this.$store.commit('app/setTagsList', tagsList);
    }
  }).$mount('#app')
})

var chatHub = null;
var connected = null;
var baseUrl="http://localhost:21021/";
abp.signalr.startConnection(baseUrl+"chatHub", function (connection) {
  connected=connection
  chatHub = connection; // Save a reference to the hub
  connection.on('getMessage', function (message) { // Register for incoming messages
    alert(message)
    // store.commit(APP_MUTATIONS.ADD_NOTIFICATION, message);
  });
}).then(function (connection) {
  abp.log.debug('Connected to myChatHub server!');
  // store.dispatch(AppActions.subscribeNotification);
  abp.event.trigger('connected');
});
document.addEventListener("click", function(){
  var message="Test Notification";
  connected.invoke("Send",message).catch(function(err){
    return console.error(err.toString())
  })
})