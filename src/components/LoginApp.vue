<script>

import  { BASEURL, baseFetch } from './baseManager'

export default {
  emits: ["login"],
  data() {
    return {
      username: "",
      password: "",
    }
  },
  methods: {
    logout() {
    localStorage.token=''
    localStorage.username='NotLoggedIn' 
    this.$emit('login','NotLoggedIn')
    },

    login() {
      var item = { username: this.username, password: this.password }
      baseFetch(`${BASEURL}/tables/login`,'POST',item).then(
        response => { 
            console.log("Login ",response)
            localStorage.token=response.token
            localStorage.username=response.username
            this.$emit('login',response.username)
            } )
            .catch(error => console.log("login",error) )
    }

  }
}
</script>

<template>
<div class="col mb-3">
  <label for="formGroupExampleInput" class="form-label">Username</label>
  <input type="text" class="form-control" v-model="username">
</div>
<div class="col mb-3">
  <label for="formGroupExampleInput2" class="form-label">Password</label>
  <input type="password" class="form-control" v-model="password">
</div>
<div class="d-grid gap-2">
  <button class="btn btn-outline-primary btn-sm" @click="login">Login</button>
  <button class="btn btn-outline-primary btn-sm" @click="logout">Logout</button>
</div>
</template> 
