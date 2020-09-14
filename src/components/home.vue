<template lang='pug'>
  .star-wars
    vue-headful(
      title="Starships"
    )
    div.preloader(
      v-if="preloader"
    ) Идет загрузка...
    template(
      v-else
    )
      form.search
        input.search-text(
          v-model="filter"
          name="ship"
          value=""
          placeholder="Search ship..."
        )
      ul.ships
        template(
          v-if="filter"
        )
          li.ship(
            v-for="ship of searchIcons"
          )
            img.ship-icon(
              src="https://img.icons8.com/wired/48/000000/space-ship.png"
              alt=""
            )
            span.ship-name {{ ship.name }}
            button.ship.full(
              @click.prevent="getShip(ship.url)"
            ) Подробнее
        template(
          v-else
        )
          li.ship(
            v-for="ship of ships"
          )
            img.ship-icon(
              src="https://img.icons8.com/wired/48/000000/space-ship.png"
              alt=""
            )
            span.ship-name {{ ship.name }}
            button.ship.full(
              @click.prevent="getShip(ship.url)"
            ) Подробнее
      .pages
        button(
          @click.prevent="prevPage"
          v-if="previous !== null"
        ) Prev
        button(
          @click.prevent="nextPage"
          v-if="next !== null"
        ) Next
</template>
<script>
export default {
  name: 'StarWars',
  data() {
    return {
      preloader: false,
      ships: {},
      count: '',
      next: '',
      previous: '',
      filter: ''
    }
  },
  computed: {
    searchIcons() {
      let posts = this.ships;
      if (this.filter) {
        posts = posts.filter((p) => {
          let tags = p.name.toLowerCase();
          let url = {};
          if (window.location.search.length > 0) {
            let search = window.location.search.substring(1);
            url = this.queryToObjs(search);
            url.filter = this.filter.toLowerCase();
          } else {
            url.filter = this.filter.toLowerCase();
          }
          let queryString = Object.keys(url).map(key => key + '=' + url[key]).join('&');
          window.history.pushState(null, null, '/?' + queryString);
          return tags.indexOf(this.filter.toLowerCase()) !== -1;
        })
      }
      return posts
    }
  },
  methods: {
    queryToObjs(queryString) {
      let query = {};
      let pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
      for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      }
      return query;
    },
    getShips() {
      this.preloader = true;
      this.axios.get('/api/starships/').then((response) => {
        this.ships = response.data.results;
        this.count = response.data.count;
        this.next = response.data.next;
        this.previous = response.data.previous;
        this.preloader = false;
      }, (responce) => {
        this.preloader = false;
      })
    },
    getShip(url) {
      const idRegExp = /\/([0-9]*)\/$/;
      let id = url.match(idRegExp)[1];
      this.$router.push('/ship/' + id)
    },
    getParams() {
      if (this.$route.query.page) {
        this.preloader = true;
        this.axios.get('/api/starships/?page=' + this.$route.query.page).then((response) => {
          this.ships = response.data.results;
          this.count = response.data.count;
          this.next = response.data.next;
          this.previous = response.data.previous;
          this.preloader = false;
          if (this.$route.query.filter) {
            this.filter = this.$route.query.filter
          }
        }, (responce) => {
          this.preloader = false;
          console.error(responce)
        });
      } else {
        this.getShips();
        if (this.$route.query.filter) {
          this.filter = this.$route.query.filter
        }
      }
    },
    nextPage() {
      this.preloader = true;
      let page = this.next.replace('http://swapi.dev/api/starships/?page=', '');
      if (this.$route.query.filter) {
        window.history.pushState(null, null, window.location.search.split('?')[0] + '?page=' + page + '&filter=' + this.$route.query.filter);
      } else {
        window.history.pushState(null, null, window.location.search.split('?')[0] + '?page=' + page);
      }

      this.axios.get('/api/starships/?page=' + page).then((response) => {
        this.ships = response.data.results;
        this.count = response.data.count;
        this.next = response.data.next;
        this.previous = response.data.previous;
        this.preloader = false;
      }, (responce) => {
        this.preloader = false;
        console.error(responce)
      })
    },
    prevPage() {
      this.preloader = true;
      let page = this.previous.replace('http://swapi.dev/api/starships/?page=', '');
      if (this.$route.query.filter) {
        window.history.pushState(null, null, window.location.search.split('?')[0] + '?page=' + page + '&filter=' + this.$route.query.filter);
      } else {
        window.history.pushState(null, null, window.location.search.split('?')[0] + '?page=' + page);
      }
      this.axios.get('/api/starships/?page=' + page).then((response) => {
        this.ships = response.data.results;
        this.count = response.data.count;
        this.next = response.data.next;
        this.previous = response.data.previous;
        this.preloader = false;
        if (this.$route.query.filter) {
          this.filter = this.$route.query.filter
        }
      }, (responce) => {
        this.preloader = false;
        console.error(responce)
      })
    }
  },
  mounted() {
    this.getParams(this.$route.fullPath);
  },
  watch: {
    filter: function (val) {
      if (val === '') {
        window.history.pushState(null, null, window.location.search.split('filter=')[0]);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.star-wars {
  .pages {
    text-align: center;
    padding: 20px 0;

    button {
      margin: 0 20px;
    }
  }

  width: 100%;

  .preloader {
    padding: 50px 0;
    text-align: center;
    color: green;
    font-size: 30px;
    font-weight: bold;
  }

  .search {
    margin-bottom: 30px;

    .search-text {
      width: 100%;
      background: #fff;
      border: 1px solid #333;
      padding: 10px 20px;
      border-radius: 4px;
      font: 16px Arial, sans-serif;
      color: #000000;
    }
  }

  .ships {
    padding: 0;
    margin: 0;

    .ship {
      padding: 0;
      margin: 0 0 20px 0;
      list-style: none;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;

      &:last-child {
        margin-bottom: 0;
      }

      .ship-name {
        display: inline-block;
        padding: 0 20px;
        font-weight: bold;
      }
    }
  }
}
</style>
