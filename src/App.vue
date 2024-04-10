<script>

import { BASEDATA, BASEURL, baseFetch, baseReload } from './components/baseManager'
import LoginApp from './components/LoginApp.vue'
import NavApp from './components/NavApp.vue'

export default {
  data() {
    return {
      version: "0.0.0",
       user: sessionStorage.username,
      islogin: false,
      timer: "00:00:00",
      offset: 0,
      servtime: 0,
    }
  },
  components: {
    LoginApp,
    NavApp
    },

  mounted() {
    this.startClock()
    //this.getlatlon()
    },
  
  methods: {

    async tableSave() {
      var r = window.confirm("Save database ?");
      if (r === true) {
        await baseFetch(`${BASEURL}/tables/saveall`, "POST", {});
      }
    },

    async startClock() {
      var servtime = await baseReload(BASEURL + `/server/time`);
      this.servtime = parseInt(servtime.servtime);
      setInterval(this.updtTimer, 1000);
    },

    updtTimer() {
      this.servtime += 1000;
      var now = new Date(this.servtime).getTime();
      var ND = new Date(now).toLocaleString("en-CA", { hour12: false });
      this.timer = ND.slice(0, 20).replace("T", " ").replace(",","");
    },

    login(user) {
      this.user = user
    },

    getVersion() {
      baseReload('/schedman/version.json').then(
        (resp) => { this.version = resp.version; console.log("version ",this.version) }
      )}

  }
}
</script>

<template>

   
        <div class="container-fluid">
          <div class="row align-items-start">
            <div class="col-2"></div>
            <div class="col-2 "><h3 style="padding-top: 10px;">Worklog Manager </h3></div>
            <div class="col-2"><h3 style="padding-top: 10px;">Version: {{ version }} </h3></div>
            <div class="col-2"><h3 style="padding-top: 10px;">{{ user }}</h3></div>
            <div class="col-4"><h4 style="padding-top: 10px">{{ timer }}</h4></div>
        </div>

        <div class="row align-items-start">
        <div class="col-2">     
            <div class="card" style="background-color: lightgray">
              <a @click="islogin = !islogin">
                  <i class="blue bi-folder-fill"></i>
                  Login</a> 
                <LoginApp v-if="islogin" @login="login"/>
              <a @click="tableSave">
                <i class="red bi-file-arrow-down"></i>
              Save</a>

            </div>
        </div>

        <div class="col-10">
            <div class="card" style="background-color: lightgray">
                <NavApp :floor="floor" :zone="zone" />
            </div>
        </div>
        </div>
    </div>

  
</template>

<style>
.red { color:red; background:lightgray; }
.blue { color:blue; background:lightgray; }
.green { color:green; background:lightgray; }
.short { width: 8em; }
.shorter { width: 5em; }
</style>
