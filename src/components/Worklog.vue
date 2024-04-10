
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
      loguser: localStorage.username,

      data: []
      /*
        [
          { id: 2,"topic": "networking", "week": 1, "desc": "overview" },
          { id: 3,"topic": "routers", "week": 1, "desc": "manage network" },
          { id: 4,"topic": "switches", "week": 1, "desc": "device connect" },
          { id: 5,"topic": "nat", "week": 1, "desc": "network address translation" },
          { id: 6,"topic": "dhcp", "week": 1, "desc": "provides ip" },
          { id: 7,"topic": "dns", "week": 1, "desc": "domain name system" },
          { id: 8,"topic": "basic html", "week": 1, "desc": "introduction" },
          { id: 9,"topic": "simple html page", "week": 1, "desc": "login example" },
          { id: 10,"topic": "manage switch installation", "week": 1, "desc": "switch setup" },
          { id: 11,"topic": "basic login screen", "week": 1, "desc": "created login screen" },
          { id: 12,"topic": "css", "week": 2, "desc": "cascading style sheets" },
          { id: 13,"topic": "bootstrap", "week": 2, "desc": "front-end framework" },
          { id: 14,"topic": "vue.js install", "week": 2, "desc": "installed vue.js" },
          { id: 15,"topic": "json", "week": 2, "desc": "javascript" },
          { id: 16,"topic": "git", "week": 2, "desc": "setup git account" },
          { id: 17,"topic": "javascript", "week": 3, "desc": "login functions"}
                                                                                             
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
      updtItem: function (item) {
    baseFetch(BASEURL + '/tables/worklog','PUT', item).then(
        response => { 
           
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
      save() {
        if (window.confirm("Do you really want to leave?")) {
          baseFetch(`${BASEURL}/tables/saveall`,'POST',{})
}       

},

reload(){
  baseReload(BASEURL + '/tables/worklog').then(
        (resp) => { this.data = resp })
} , 

login() {
  var item = { username: this.username, password: this.password }
  baseFetch(`${BASEURL}/tables/login`,'POST',item).then(
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
  var servtime = await baseReload(BASEURL + `/server/time`);
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

getVersion() {
          baseReload('/freeloader/version.json').then(
            (resp) => { this.version = resp.version; console.log("version ",this.version) }
          )},

       async startClock() {
      var servtime = await baseReload(BASEURL + `/server/time`);
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


  <main>
   
    <div class="container">
      <div class="row">
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
                &nbsp;
                <button class="btn btn-success btn-sm" @click="updtItem(item)">Update</button>
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

                                                                           
