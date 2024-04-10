<script>

import  { BASEURL, baseFetch, baseReload } from './baseManager'

const URL1 = () => `${BASEURL}/tables/users`;
const URL2 = (id) => `${BASEURL}/tables/users/${id}`;

export default {
  mounted() { this.reload() },
  data() {
    return {
      items: [],
      username: 'operator',
      password: '',
      role: 'user',
      help: false
    }
  },
  methods: {

    reload() {
        baseReload(URL1()).then(
            (resp) => this.items=resp 
            ).catch(result => console.log(result) )
        },
        
    dropUser(item) {
        var r=window.confirm('Delete User ?');
        if (r === true) {
          baseFetch(URL2(item.id),'DELETE').then(
              () => this.items=this.items.filter(el => el._id !== item._id)
            ).catch(error => console.log("dropUser",error) )
            }
        },
        
    addUser() {
        var item = { username: this.username, password: this.password, role: this.role, roles: [ this.role ] }
        baseFetch(URL1(),'POST',item).then(
            (resp) => this.items=this.items.concat([item])
            ).catch(result => console.log(result) )
        }
      }
    }
</script>  

<template>  
    <div>
      <h4 :style="{ textAlign: 'center'}">User View</h4>
                
        <br/>

    <div className="btn-group" role="group" style="padding: 10px">
        <button class="btn btn-outline-success btn-sm" @click="help=!help">Help</button>
        <button class="btn btn-outline-primary btn-sm " @click="reload">Refresh</button>
        <button class="btn btn-outline-secondary btn-sm " @click="addUser">Adduser</button>
    </div>

    <p v-if="help">This screen allows adding and removing users.
        <br/>A user with admin privilege would have access to more functions.
        <br/><b>Refresh</b> updates the displayed user list.
        <br/><b>Adduser</b> adds a new user as specified.
        <br/><b>Drop</b> drops a user from the system system.
    </p> 

      <table class="table-borderless table-sm">
        <thead>
        <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Role</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>
            <input type="text" name="username" v-model="username" />
            </td><td>
            <input type="password" name="password" v-model="password" />
             </td><td>
            <select class="form-select form-select-sm" v-model="role"> 
                  <option value="user">user</option>
                  <option value="admin">admin</option>
            </select>
            </td>
        </tr></tbody></table>

      <table class="table-sm table-condensed">
        <thead>
          <tr>
            <th style="width: 12em">Username</th>
            <th style="width: 12em">Roles</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user of items" style="font-size: '16px'">
              <td><span style="width: 10em" >{{user.username}}</span></td>
              <td><span style="width: 20em" >{{user.roles}}</span></td>
              <td><button class="btn btn-danger btn-sm " @click="dropUser(user)">Drop</button></td>
          </tr>
      </tbody>
      </table>
    </div>
    </template>