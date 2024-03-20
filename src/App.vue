<script>
import {BASEURL,baseFetch,baseReload} from "./baseManager"

export default {

  mounted() {
              this.startClock()
              this.reload()
            },

  name: 'My list',
  
  data: function () {
    return {
      cont: {"week":0},
      timer: "000000",
      username: "",
      password: "",
      newitem: {topic:"",desc:"", id:0,"week":0},
      servtime: 0,
      data: "",
      loguser: localStorage.username,
      /*
        [
          { "topic": "networking", "week": 1, "desc": "overview" },
          { "topic": "routers", "week": 1, "desc": "manage network" },
          { "topic": "switches", "week": 1, "desc": "device connect" },
          { "topic": "nat", "week": 1, "desc": "network address translation" },
          { "topic": "dhcp", "week": 1, "desc": "provides ip" },
          { "topic": "dns", "week": 1, "desc": "domain name system" },
          { "topic": "basic html", "week": 1, "desc": "introduction" },
          { "topic": "simple html page", "week": 1, "desc": "login example" },
          { "topic": "manage switch installation", "week": 1, "desc": "switch setup" },
          { "topic": "basic login screen", "week": 1, "desc": "created login screen" },
          { "topic": "css", "week": 2, "desc": "cascading style sheets" },
          { "topic": "bootstrap", "week": 2, "desc": "front-end framework" },
          { "topic": "vue.js install", "week": 2, "desc": "installed vue.js" },
          { "topic": "json", "week": 2, "desc": "javascript" },
          { "topic": "git", "week": 2, "desc": "setup git account" },
          { "topic": "javascript", "week": 3, "desc": "login functions"}

      
        ],
        */
    }
  },
   

        methods: { 
          addItem: function () {
    baseFetch(BASEURL + '/tables/worklog','POST', this.newitem).then(
        response => { 
            this.newitem.id = response.id 
            this.data.push(this.newitem)
        })
        .catch(result => console.log("addFloor",result))
      },
        delItem(item) {
          console.log("theitem",item)
    baseFetch(BASEURL + '/tables/worklog/'+item.id,'DELETE').then(
        () => this.data=this.data.filter(el => el.id !== item.id)
      ).catch(error => console.log("delFloor",error) )
   },

          logout() {
    localStorage.token=''
    localStorage.username='NotLoggedIn' 
    //this.$emit('login','NotLoggedIn')
    },

    reload(){
      baseReload(BASEURL + '/tables/worklog').then(
            (resp) => { this.data = resp })
    } , 

    login() {
      var item = { username: this.username, password: this.password }
      baseFetch(`${BASEURL}/config/login`,'POST',item).then(
        response => { 
            console.log("Login ",response)
            localStorage.token=response.token
            localStorage.username=response.username
            //this.$emit('login',response.username)
            this.loguser=response.username
            } )
            .catch(error => console.log("login",error) )
    },


        getVersion() {
          baseReload('/freeloader/version.json').then(
            (resp) => { this.version = resp.version; console.log("version ",this.version) }
          )},

       async startClock() {
      var servtime = await baseReload(BASEURL + `/system/time`);
      //this.servtime = new Date()
      this.servtime = parseInt(servtime.servtime);
      console.log("servtime",this.servtime)
      setInterval(this.updtTimer, 1000);
    },

    updtTimer() {
      this.servtime += 1000;
      var now = new Date(this.servtime).getTime();
      var ND = new Date(now).toLocaleString("en-CA", { hour12: false });
      this.timer = ND.slice(0, 20).replace("T", " ")
    },

  }
      
}

</script>

<template>

    <div class="container">
      <div class="row">
        <div class="col-sm">
        {{loguser}}
        </div>
        <div class="col-sm">
          Version 2.7.24
        </div>
        <div class="col-sm">
          {{ timer }}
        </div>
      </div>
    </div>

  <main>
    <br />
    <div class="container">
      <div class="row">
        <div class="card" style="width: 19rem;">
          <div class="card-body" style="width: 10rem;">
            <label for="username">Username:</label><br />
            <input type="text" name="username" id="name" v-model="username" placeholder="Levi Richer" required /><br />
            <label for="Password"> Password:</label><br />
            <input type="password" name="password" v-model="password" id="password" placeholder="Password" required /><br />
            <br/>
            <button class="btn btn-success" @click="login">Login</button> 
          </div>
        </div>
        <div class="col-lg">
          <div>
            <table>
              <thead><th>Topic</th><th>Description</th><th>Week</th></thead>

              <tr>
<td><input type="text" class="input-sm" v-model="newitem.topic" /></td>
<td><input type="text" class="input" v-model="newitem.desc" /></td>
<td><input type="number" class="input-sm" v-model="newitem.week" /></td>
<td>{{ newitem.id }}</td>

<td><button class="btn btn-success btn-sm" @click="addItem">Add</button></td>
</tr>

              <tr v-for="item in data" :key="item.topic" >
                <td>
                  <a @click="cont = item" class="NFM">
                    <span v-bind:class="{ red: item.topic == cont.topic }">
                      <i class="fa fa-star"></i>
                      {{ item.topic }}</span>
                    </a>

                </td>
                <td>&nbsp; {{ item.desc }}</td>
                <td>&nbsp; {{ item.week }}</td>
                <button class="btn btn-danger btn-sm" @click="delItem(item)">Del</button>
              </tr>


            </table>
          </div>

        </div>
      </div>
</div>
  </main>
</template>

<style>
.red {
  color: red;
  background: lightgrey
}
</style>
