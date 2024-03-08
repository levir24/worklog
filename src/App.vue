<script>

export default {
  name: 'My list',
  
  data: function () {
    return {
      cont: {"week":0},
      timer: "000000", 
      servtime: new Date().getTime(),
      data:
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
          { "topic": "git", "week": 2, "desc": "setup git account" }

      
        ],
    }
  },
      mounted() {
              this.startClock()
            },

        methods: {

        login(user) {
          this.user = user
          },

        getVersion() {
          baseReload('/freeloader/version.json').then(
            (resp) => { this.version = resp.version; console.log("version ",this.version) }
          )},

          async startClock() {
            var offset = 0 //await baseReload(`${BASEREDIS}/get/OFFSET`)
            this.offset = offset == null ? 0 : parseInt(offset)
            var tzoffset = 300 //await baseReload(`${BASEREDIS}/get/TZOFFSET`)
            this.tzoffset = tzoffset == null ? 300 : parseInt(tzoffset) 
            this.servtime =  new Date().getTime() //await baseReload(BASEURL+`/system/time`)
            console.log("time",this.servtime)
            //this.servtime = parseInt(servtime.servtime)
            setInterval(this.updtTimer, 1000);
          },

        setOffset() { 
          baseFetch(`${BASEREDIS}/set/OFFSET/${this.offset}`,'POST',{})
          baseFetch(`${BASEREDIS}/set/TZOFFSET/${this.tzoffset}`,'POST',{})
        },

        updtTimer() {
          this.servtime += 1000
          var now = new Date(this.servtime).getTime() 
          var now2 =  now - (this.tzoffset*60000)  + (this.offset*60000)
          var ND = new Date(now2).toISOString();
          this.timer = ND.slice(0,19).replace('T',' ')
          },
        },
}

</script>

<template>
  <header>
    <div class="container">
      <div class="row">
        <div class="col-sm">
          My List
        </div>
        <div class="col-sm">
          Version 2.7.24
        </div>
        <div class="col-sm">
          {{timer}}
        </div>
      </div>
    </div>
  </header>

  <main>
    <br />
    <div class="container">
      <div class="row">
        <div class="card" style="width: 19rem;">
          <div class="card-body" style="width: 10rem;">
            <label for="username">Username:</label><br />
            <input type="text" name="username" id="name" placeholder="Levi Richer" required /><br />
            <label for="Password"> Password:</label><br />
            <input type="password" name="password" id="password" placeholder="Password" required /><br />
            <br/>
            <button class="btn btn-success" onclick="myFunction()">Login</button> 
          </div>
        </div>
        <div class="col-lg">
          <div>
            <table>
              <thead><th>Topic</th><th>Description</th><th>Week</th></thead>
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
