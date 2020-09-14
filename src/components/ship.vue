<template lang='pug'>
  .ship
    div.preloader(
      v-if="preloader"
    ) Идет загрузка...
    template(
      v-else
    )
      vue-headful(
        :title="ship.name"
      )
      h1.title {{ ship.name }}
      ul.about
        li.item
          strong.item-title MGLT:
          span.item-value {{ ship.MGLT }}
        li.item
          strong.item-title Cargo capacity:
          span.item-value {{ ship.cargo_capacity }}
        li.item
          strong.item-title Consumables":
          span.item-value {{ ship.consumables }}
        li.item
          strong.item-title Cost in credits:
          span.item-value {{ ship.cost_in_credits }}
        li.item
          strong.item-title Created:
          span.item-value {{ ship.created }}
        li.item
          strong.item-title Crew:
          span.item-value {{ ship.crew }}
        li.item
          strong.item-title Edited:
          span.item-value {{ ship.edited }}
        li.item
          strong.item-title Hyperdrive rating:
          span.item-value {{ ship.hyperdrive_rating }}
        li.item
          strong.item-title Manufacturer:
          span.item-value {{ ship.manufacturer }}
        li.item
          strong.item-title Max atmosphering speed:
          span.item-value {{ ship.max_atmosphering_speed }}
        li.item
          strong.item-title Length:
          span.item-value {{ ship.length }}
        li.item
          strong.item-title Passengers:
          span.item-value {{ ship.passengers }}
        li.item
          strong.item-title Url:
          span.item-value {{ ship.url }}
        li.item
          strong.item-title Starship class:
          span.item-value {{ ship.starship_class }}
        li.item(v-if="pilots.length > 0")
          strong.item-title Pilots:
          span.item-value
            span(v-for="(pilot, index) of pilots")
              span {{ pilot }}
                span(v-if="index+1 < pilots.length") ,
                  = ' '
        li.item(v-if="films.length > 0")
          strong.item-title Films:
          span.item-value
            span(
              v-for="(film, index) of films"
            )
              span {{ film }}
                span(v-if="index+1 < films.length") ,
                  = ' '
      div.back
        router-link(
          to="/"
        ) Back to ships
</template>

<script>
export default {
  name: "ship",
  data() {
    return {
      preloader: false,
      id: this.$router.currentRoute.params['id'],
      ship: {},
      films: [],
      pilots: []
    }
  },
  methods: {
    getShip() {
      this.preloader = true;
      this.axios.get('/api/starships/' + this.id + '/').then((response) => {
        this.ship = response.data;
        if (response.data.pilots.length > 0) {
          for (let key of response.data.pilots) {
            let url = key.replace('http://swapi.dev', '')
            this.axios.get(url).then((response) => {
              this.pilots.push(response.data.name)
            }, (responce) => {
              console.error(responce)
            })
          }
        }
        if (response.data.films.length > 0) {
          for (let key of response.data.films) {
            let url = key.replace('http://swapi.dev', '');
            this.axios.get(url).then((response) => {
              this.films.push(response.data.title)
            }, (responce) => {
              this.preloader = false;
              console.error(responce)
            })
          }
        }
        this.preloader = false;
      }, (responce) => {
        this.preloader = false;
        console.error(responce)
      })
    }
  },
  mounted() {
    this.getShip();
  }
}
</script>

<style lang="scss" scoped>
.back {
  padding: 20px 0;
}

.preloader {
  padding: 50px 0;
  text-align: center;
  color: green;
  font-size: 30px;
  font-weight: bold;
}

h1.title {
  font-size: 30px;
}

ul.about {
  padding: 0;
  margin: 0;

  .item {
    padding: 0;
    margin: 0 0 10px 0;
    list-style: none;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;

    &:last-child {
      margin-bottom: 0;
    }

    .item-title {
      margin-right: 10px;
    }
  }
}
</style>
