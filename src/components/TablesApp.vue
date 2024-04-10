<script>
import { BASEDATA, baseFetch, baseReload } from "./baseManager";

export default {
  mounted() {
    this.reload();
  },
  data() {
    return {
      tables: [],
      backlist: [],
      help: false,
    };
  },
  methods: {
    reload() {
      baseReload(BASEDATA + "/tables/status")
        .then((resp) => (this.tables = resp))
        .catch((result) => console.log(result));
      baseReload(BASEDATA + "/tables/backlist")
        .then((resp) => (this.backlist = resp))
        .catch((result) => console.log(result));
    },

    backup() {
      baseReload(BASEDATA + "/tables/backup")
        .then((resp) => {
          var r = window.confirm("Backup: " + resp);
        })
        .catch((result) => console.log(result));
    },

    reset() {
      var r = window.confirm("Reset ?");
      if (r === true) {
        baseFetch(BASEDATA + "/tables/reset", "POST", {});
      }
    },

    restore(file) {
      var r = window.confirm("Restore ?");
      if (r === true) {
        baseFetch(BASEDATA + "/tablesrestore", "POST", { name: file });
      }
    },

    getname(path, file) {
      return `/schedman/api/uploads/${path}/${file}`;
    },
  },
};
</script>

<template>
  <div>
    <h4 class="table table-sm" style="text-align: center">Tables View</h4>

    <hr />

    <div class="btn-group" role="group" style="padding: 10px">
      <button class="btn btn-outline-primary btn-sm" @click="reload">Reload</button>
      <button class="btn btn-outline-primary btn-sm" @click="reset">Reset</button>
      <button class="btn btn-outline-primary btn-sm" @click="backup">Backup</button>
    </div>

    <table class="table-sm table-condensed">
      <thead>
        <tr>
          <th style="width: 12em">Name</th>
          <th style="width: 12em">Count</th>
          <th style="width: 12em">Dirty</th>
          <th style="width: 12em">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="table of tables">
          <td>{{ table.name }}</td>
          <td>{{ table.count }}</td>
          <td>{{ table.dirty }}</td>
          <td>{{ table.date }}</td>
        </tr>
      </tbody>
    </table>

    <hr />

    <table class="table-sm">
      <thead>
        <tr>
          <th  style="width: 12em">Name</th>
          <th style="width: 12em">Size</th>
          <th style="width: 12em">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of backlist">
          <td>{{ item.name }}</td>
          <td>{{ item.size }}</td>
          <td>{{ item.date }}</td>
          <td>
            &nbsp;
            <button class="btn btn-danger btn-sm" @click="restore(item)">Restore</button>
            &nbsp;
            <a
              :href="getname('backup', item.name)"
              download
              class="btn btn-success btn-sm"
              >Download</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

